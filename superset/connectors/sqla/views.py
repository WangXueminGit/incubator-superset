import logging
import re

from flask import Markup, flash, request, redirect
from flask_login import current_user
from flask_appbuilder import CompactCRUDMixin, expose
from flask_appbuilder.actions import action
from flask_appbuilder.models.sqla.interface import SQLAInterface
import sqlalchemy as sa

from flask_babel import lazy_gettext as _
from flask_babel import gettext as __

from superset import appbuilder, db, utils, security, sm
from superset.utils import has_access
from superset.views.base import (
    SupersetModelView, ListWidgetWithCheckboxes, DeleteMixin, DatasourceFilter,
    get_datasource_exist_error_mgs,
)
from superset.models.core import Database

from . import models


class TableColumnInlineView(CompactCRUDMixin, SupersetModelView):  # noqa
    datamodel = SQLAInterface(models.TableColumn)
    can_delete = False
    list_widget = ListWidgetWithCheckboxes
    edit_columns = [
        'column_name', 'verbose_name', 'description',
        'type', 'groupby', 'filterable',
        'table', 'count_distinct', 'sum', 'min', 'max', 'expression',
        'is_dttm', 'python_date_format', 'database_expression']
    add_columns = edit_columns
    list_columns = [
        'column_name', 'type', 'groupby', 'filterable', 'count_distinct',
        'sum', 'min', 'max', 'is_dttm']
    page_size = 500
    description_columns = {
        'is_dttm': _(
            "Whether to make this column available as a "
            "[Time Granularity] option, column has to be DATETIME or "
            "DATETIME-like"),
        'type': _(
            "The data type that was inferred by the database. "
            "It may be necessary to input a type manually for "
            "expression-defined columns in some cases. In most case "
            "users should not need to alter this."),
        'expression': utils.markdown(
            "a valid SQL expression as supported by the underlying backend. "
            "Example: `substr(name, 1, 1)`", True),
        'python_date_format': utils.markdown(Markup(
            "The pattern of timestamp format, use "
            "<a href='https://docs.python.org/2/library/"
            "datetime.html#strftime-strptime-behavior'>"
            "python datetime string pattern</a> "
            "expression. If time is stored in epoch "
            "format, put `epoch_s` or `epoch_ms`. Leave `Database Expression` "
            "below empty if timestamp is stored in "
            "String or Integer(epoch) type"), True),
        'database_expression': utils.markdown(
            "The database expression to cast internal datetime "
            "constants to database date/timestamp type according to the DBAPI. "
            "The expression should follow the pattern of "
            "%Y-%m-%d %H:%M:%S, based on different DBAPI. "
            "The string should be a python string formatter \n"
            "`Ex: TO_DATE('{}', 'YYYY-MM-DD HH24:MI:SS')` for Oracle"
            "Superset uses default expression based on DB URI if this "
            "field is blank.", True),
    }
    label_columns = {
        'column_name': _("Column"),
        'verbose_name': _("Verbose Name"),
        'description': _("Description"),
        'groupby': _("Groupable"),
        'filterable': _("Filterable"),
        'table': _("Table"),
        'count_distinct': _("Count Distinct"),
        'sum': _("Sum"),
        'min': _("Min"),
        'max': _("Max"),
        'expression': _("Expression"),
        'is_dttm': _("Is temporal"),
        'python_date_format': _("Datetime Format"),
        'database_expression': _("Database Expression")
    }
appbuilder.add_view_no_menu(TableColumnInlineView)


class SqlMetricInlineView(CompactCRUDMixin, SupersetModelView):  # noqa
    datamodel = SQLAInterface(models.SqlMetric)
    list_columns = ['metric_name', 'verbose_name', 'metric_type']
    edit_columns = [
        'metric_name', 'description', 'verbose_name', 'metric_type',
        'expression', 'table', 'd3format', 'is_restricted']
    description_columns = {
        'metric_name': utils.markdown("Alias of column. For example: `SELECT COUNT(*) AS alias`", True),
        'verbose_name': utils.markdown("ID for this column which **Explore View**", True),
        'expression': utils.markdown(
            "a valid SQL expression as supported by the underlying backend. "
            "Example: `count(DISTINCT userid)`", True),
        'is_restricted': _("Whether the access to this metric is restricted "
                           "to certain roles. Only roles with the permission "
                           "'metric access on XXX (the name of this metric)' "
                           "are allowed to access this metric"),
        'd3format': utils.markdown(
            "d3 formatting string as defined [here]"
            "(https://github.com/d3/d3-format/blob/master/README.md#format). "
            "For instance, this default formatting applies in the Table "
            "visualization and allow for different metric to use different "
            "formats", True
        ),
    }
    add_columns = edit_columns
    page_size = 500
    label_columns = {
        'metric_name': _("Metric"),
        'description': _("Description"),
        'verbose_name': _("Verbose Name"),
        'metric_type': _("Type"),
        'expression': _("SQL Expression"),
        'table': _("Table"),
    }

    def post_add(self, metric):
        if metric.is_restricted:
            security.merge_perm(sm, 'metric_access', metric.get_perm())

    def post_update(self, metric):
        if metric.is_restricted:
            security.merge_perm(sm, 'metric_access', metric.get_perm())

appbuilder.add_view_no_menu(SqlMetricInlineView)


class TableModelView(SupersetModelView, DeleteMixin):  # noqa
    datamodel = SQLAInterface(models.SqlaTable)
    list_columns = [
        'link', 'database', 'is_featured',
        'changed_by_', 'changed_on_']
    order_columns = [
        'link', 'database', 'is_featured', 'changed_on_']
    add_columns = ['database', 'schema', 'table_name', 'parquet_path']
    edit_columns = [
        'table_name', 'sql', 'is_featured', 'filter_select_enabled',
        'database', 'schema',
        'description', 'owner',
        'main_dttm_col', 'default_endpoint', 'offset', 'cache_timeout']
    show_columns = edit_columns + ['perm'] + ['parquet_path']
    related_views = [TableColumnInlineView, SqlMetricInlineView]
    base_order = ('changed_on', 'desc')
    description_columns = {
        'offset': _("Timezone offset (in hours) for this datasource"),
        'table_name': _(
            "Name of the table that exists in the source database"),
        'schema': _(
            "Schema, as used only in some databases like Postgres, Redshift "
            "and DB2"),
        'description': Markup(
            "Supports <a href='https://daringfireball.net/projects/markdown/'>"
            "markdown</a>"),
        'sql': _(
            "This fields acts a Superset view, meaning that Superset will "
            "run a query against this string as a subquery."
        ),
        'parquet_path': utils.markdown(
            "Add a Parquet file path to create a table in database. "
            "Leave blank if table exists. "
            "It is only applicable for **Shopee Playground** database. ", True
        )
    }
    base_filters = [['id', DatasourceFilter, lambda: []]]
    label_columns = {
        'link': _("Table"),
        'changed_by_': _("Changed By"),
        'database': _("Database"),
        'changed_on_': _("Last Changed"),
        'is_featured': _("Is Featured"),
        'filter_select_enabled': _("Enable Filter Select"),
        'schema': _("Schema"),
        'default_endpoint': _("Default Endpoint"),
        'offset': _("Offset"),
        'cache_timeout': _("Cache Timeout"),
        'parquet_path': _("Path of Parquet file"),
    }

    def pre_add(self, table):
        database = db.session.query(Database).get(table.database.id)
        if database.allow_parquet_table and table.table_name is not None and len(table.parquet_path) > 0:
            username = re.sub('[^a-zA-Z0-9]', '_', current_user.username)
            table.table_name = table.table_name + '__' + username

        number_of_existing_tables = db.session.query(
            sa.func.count('*')).filter(
            models.SqlaTable.table_name == table.table_name,
            models.SqlaTable.schema == table.schema,
            models.SqlaTable.database_id == table.database.id
        ).scalar()
        # table object is already added to the session
        if number_of_existing_tables > 1:
            raise Exception(get_datasource_exist_error_mgs(table.full_name))

        # Create Table based on Parquet path
        if database.allow_parquet_table and table.table_name is not None and len(table.parquet_path) > 0:
            engine = database.get_sqla_engine()
            connection = engine.connect()
            transaction = connection.begin()
            try:
                connection.execute('CREATE TABLE ' + table.table_name +
                               ' USING org.apache.spark.sql.parquet OPTIONS (path "' + table.parquet_path + '")')
                transaction.commit()

            except Exception as e:
                transaction.rollback()
                logging.exception(e)
                raise Exception(
                    "Parquet file [{}] could not be found, "
                    "please double check your "
                    "database connection, and parquet file path ".format(table.parquet_path))
            finally:
                connection.close()
                engine.dispose()

        # Fail before adding if the table can't be found
        try:
            table.get_sqla_table_object()
        except Exception as e:
            logging.exception(e)
            raise Exception(
                "Table [{}] could not be found, "
                "please double check your "
                "database connection, schema, and "
                "table name".format(table.name))

    def post_add(self, table):
        table.fetch_metadata()
        security.merge_perm(sm, 'datasource_access', table.get_perm())
        if table.schema:
            security.merge_perm(sm, 'schema_access', table.schema_perm)

        flash(_(
            "The table was created. As part of this two phase configuration "
            "process, you should now click the edit button by "
            "the new table to configure it."),
            "info")

    def post_update(self, table):
        self.post_add(table)

    @has_access
    @action("refresh_table_fields", "Refresh table columns", "Fetch changes and add columns/metrics to table?", "fa-refresh", single=True)
    def fetch_metadata(self, tables):
        if isinstance(tables, list):
            for table in tables:
                table.fetch_metadata()
        else:
            tables.fetch_metadata()
        return redirect('/tablemodelview/list/')

    @expose('/<path>/<pk>/update_columns/', methods=['POST'])
    @has_access
    def update_columns(self, path, pk):
        item = self.datamodel.get(pk, self._base_filters)
        if not item:
            return redirect('/tablemodelview/edit/' + str(pk))
        # convert pk to correct type, if pk is non string type.
        pk = self.datamodel.get_pk_value(item)
        columns = dict()
        regex_fields = re.compile('__')
        regex_columns = re.compile('##')
        availableFields = ['filterable', 'groupby', 'count_distinct', 'is_dttm', 'min', 'max']
        for field, value in request.form.iteritems():
            if regex_fields.search(field) is not None:
                field_components = field.split('__')
                column_id = str(field_components[0])
                column_type = str(field_components[1])
                if column_id not in columns:
                    columns[column_id] = []
                columns[column_id].append(column_type)

            elif regex_columns.search(field) is not None:
                field_components = field.split('##')
                if str(field_components[0]) not in columns:
                    columns[str(field_components[0])] = []

        for column, value in columns.iteritems():
            column_obj = db.session.query(models.TableColumn).get(int(column))
            if column_obj.table_id != pk:
                continue
            for column_type in availableFields:
                if hasattr(column_obj, column_type):
                    setattr(column_obj, column_type, True if column_type in value else False)
            db.session.commit()

        return redirect('/tablemodelview/' + path + '/' + str(pk) + '?success=true&type=save_columns_type')

appbuilder.add_view(
    TableModelView,
    "Tables",
    label=__("Tables"),
    category="",
    category_label="",
    icon='fa-table',)
