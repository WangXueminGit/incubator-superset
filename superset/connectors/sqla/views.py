"""Views used by the SqlAlchemy connector"""
import logging
import re

from past.builtins import basestring

from flask import Markup, flash, redirect, request
from flask_login import current_user
from flask_appbuilder import CompactCRUDMixin, expose
from flask_appbuilder.actions import action
from flask_appbuilder.models.sqla.interface import SQLAInterface
from numpy import genfromtxt
import sqlalchemy as sa

from flask_babel import lazy_gettext as _
from flask_babel import gettext as __

from flask_appbuilder.urltools import get_filter_args

from superset import appbuilder, db, utils, security, sm, config
from superset.utils import has_access
from superset.views.base import (
    SupersetModelView, ListWidgetWithCheckboxes, DeleteMixin, DatasourceFilter,
    get_datasource_exist_error_mgs,
)
from superset.models.core import Database
from superset.widgets import CustomFormWidget

from . import models


class TableColumnInlineView(CompactCRUDMixin, SupersetModelView):  # noqa
    datamodel = SQLAInterface(models.TableColumn)
    can_delete = False
    list_widget = ListWidgetWithCheckboxes
    edit_columns = [
        'column_name', 'verbose_name', 'description',
        'type', 'groupby', 'filterable',
        'table', 'count_distinct', 'sum', 'min', 'max', 'expression',
        'is_dttm', 'python_date_format', 'database_expression', 'is_hex']
    add_columns = edit_columns
    list_columns = [
        'column_name', 'type', 'groupby', 'filterable', 'count_distinct',
        'sum', 'min', 'max', 'is_dttm', 'is_hex']
    page_size = 500
    description_columns = {
        'is_hex': _(
            "Value is base16(hex) encoded"),
        'is_dttm': _(
            "Whether to make this column available as a "
            "[Time Granularity] option, column has to be DATETIME or "
            "DATETIME-like"),
        'filterable': _(
            "Whether this column is exposed in the `Filters` section "
            "of the explore view."),
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
        'database_expression': _("Database Expression"),
        'is_hex': _("Base16 encoded"),
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

    @action("delete_metrics", "Delete metric records", "Delete selected metrics from this table?", "fa-times")
    def delete_metrics(self, metrics):
        if isinstance(metrics, list):
            self.datamodel.delete_all(metrics)
        else:
            self.datamodel.delete(metrics)
        return redirect(self.get_redirect())

appbuilder.add_view_no_menu(SqlMetricInlineView)


class TableModelView(SupersetModelView, DeleteMixin):  # noqa
    datamodel = SQLAInterface(models.SqlaTable)
    list_columns = [
        'link', 'database',
        'changed_by_', 'changed_on_']
    order_columns = [
        'link', 'database', 'changed_on_']
    add_columns = ['database', 'schema', 'table_name']
    edit_columns = [
        'table_name', 'sql', 'filter_select_enabled', 'slices',
        'fetch_values_predicate', 'database', 'schema',
        'description', 'owner',
        'main_dttm_col', 'default_endpoint', 'offset', 'cache_timeout']
    show_columns = edit_columns + ['perm']
    related_views = [TableColumnInlineView, SqlMetricInlineView]
    base_order = ('changed_on', 'desc')
    description_columns = {
        'slices': _(
            "The list of slices associated with this table. By "
            "altering this datasource, you may change how these associated "
            "slices behave. "
            "Also note that slices need to point to a datasource, so "
            "this form will fail at saving if removing slices from a "
            "datasource. If you want to change the datasource for a slice, "
            "overwrite the slice from the 'explore view'"),
        'offset': _("Timezone offset (in hours) for this datasource"),
        'table_name': utils.markdown(
            "For `admin`, you can add existing tables in the datasource. "
            "For `others`, you can create new table by using the additional field below. ", True),
        'schema': utils.markdown(
            "Schema, `public` as used only in some databases like Postgres, `Redshift` "
            "and DB2", True),
        'description': Markup(
            "Supports <a href='https://daringfireball.net/projects/markdown/'>"
            "markdown</a>"),
        'sql': _(
            "This fields acts a Superset view, meaning that Superset will "
            "run a query against this string as a subquery."
        ),
        'fetch_values_predicate': _(
            "Predicate applied when fetching distinct value to "
            "populate the filter control component. Supports "
            "jinja template syntax. Applies only when "
            "`Enable Filter Select` is on."
        ),
        'default_endpoint': _(
            "Redirects to this endpoint when clicking on the table "
            "from the table list"),
        'filter_select_enabled': _(
            "Whether to populate the filter's dropdown in the explore "
            "view's filter section with a list of distinct values fetched "
            "from the backend on the fly"),
    }
    base_filters = [['id', DatasourceFilter, lambda: []]]
    label_columns = {
        'slices': _("Associated Slices"),
        'link': _("Table"),
        'changed_by_': _("Changed By"),
        'database': _("Database"),
        'changed_on_': _("Last Changed"),
        'filter_select_enabled': _("Enable Filter Select"),
        'schema': _("Schema"),
        'default_endpoint': _(
            "Redirects to this endpoint when clicking on the datasource "
            "from the datasource list"),
        'offset': _("Offset"),
        'cache_timeout': _("Cache Timeout"),
    }
    add_widget = CustomFormWidget
    custom_fields = [
        {
            "identifier": "create_option",
            "externalclass": "db_group group_allow_create_table",
            "title": "SQL type",
            "input": "radio",
            "options": [
                {
                    "label": utils.markdown("`CREATE VIEW`", True),
                    "value": "view",
                },
                {
                    "label": utils.markdown("`CREATE TABLE`", True),
                    "value": "table",
                },
            ],
            "required": False,
        },
        {
            "identifier": "create_table_sql",
            "externalclass": "db_group group_allow_create_table",
            "title": "Create table/view with SQL",
            "input": "sql",
            "placeholder": _("CREATE TABLE"),
            "description": utils.markdown(
                "Create table/view with SQL is only applicable to `Redshift`."
                , True),
            "required": False,
        },
        {
            "identifier": "hdfs_path",
            "externalclass": "db_group group_allow_hdfs_table",
            "title": "Create table from HDFS",
            "input": "text",
            "placeholder": _("Enter the full path of file from HDFS"),
            "description": utils.markdown(
                "Create table and load data FROM HDFS is only applicable to `Spark Playground`."
                , True),
            "required": False,
        },
        {
            "identifier": "hdfs_file_type",
            "externalclass": "db_group group_allow_hdfs_table",
            "title": "HDFS File type",
            "input": "select",
            "options": [
                {
                    "label": "Parquet",
                    "value": "parquet",
                },
                {
                    "label": "JSON",
                    "value": "json",
                },
            ],
            "description": utils.markdown(
                "Required if `Create table from HDFS` option is chosen."
                , True),
            "required": False,
        },
        {
            "separator": True,
            "isadmin": True,
            "message": utils.markdown("For **admin** only", True)
        },
        {
            "identifier": "create_global_table",
            "isadmin": True,
            "title": "Create table without user postfix",
            "input": "checkbox",
            "description": utils.markdown("Checked to create table without username as postfix. "
                             "For `non-Admin`, username or group name will be added by default. ", True),
            "required": False,
        },
    ]

    def _get_add_widget(self, form, exclude_cols=None, widgets=None):
        exclude_cols = exclude_cols or []
        widgets = widgets or {}

        private_roles = [role for role in current_user.roles if role.name not in config.ROBOT_PERMISSION_ROLES]
        private_roles.sort()
        is_admin = False
        for role in current_user.roles:
            if role.name in config.ROLE_CREATE_TABLE_GLOBAL:
                is_admin = True

        datasources = db.session.query(models.Database).all()
        main_datasources = [datasource for datasource in datasources if not datasource.hidden]
        sub_datasources = dict()
        datasource_groups = dict()
        datasource_allowed_action = dict()
        for datasource in datasources:
            if datasource.database_group not in datasource_groups:
                datasource_groups[datasource.id] = datasource.database_group
            if datasource.database_group not in sub_datasources:
                sub_datasources[datasource.database_group] = []
            if len(datasource.force_ctas_schema) > 0:
                for role in private_roles:
                    if role in datasource.roles:
                        sub_datasources[datasource.database_group].append(datasource.force_ctas_schema)
                if is_admin:
                    sub_datasources[datasource.database_group].append(datasource.force_ctas_schema)

            if datasource.database_group not in datasource_allowed_action:
                datasource_allowed_action[datasource.database_group] = []
            if datasource.allow_create_table:
                datasource_allowed_action[datasource.database_group].append('allow_create_table')
            if datasource.allow_hdfs_table:
                datasource_allowed_action[datasource.database_group].append('allow_hdfs_table')

        allowed_datasources = []
        if is_admin:
            allowed_datasources = main_datasources
        else:
            t_datasource_groups = []
            for datasource in datasources:
                for role in private_roles:
                    if role in datasource.roles:
                        t_datasource_groups.append(datasource.database_group)
            for datasource in main_datasources:
                if datasource.database_group in t_datasource_groups:
                    allowed_datasources.append(datasource)

        pre_include_cols = [
            {
                "identifier": "database",
                "title": "Select target database",
                "input": "select",
                "required": True,
                "model": allowed_datasources,
            },
            {
                "identifier": "schema",
                "title": "Select target schema",
                "input": "select",
                "required": False,
                "model": sub_datasources,
                "submodel": datasource_groups,
                "tertiarymodel": datasource_allowed_action,
            },
        ]
        widgets['add'] = self.add_widget(form=form,
                                         is_admin=is_admin,
                                         pre_include_cols=pre_include_cols,
                                         include_cols=self.add_columns,
                                         exclude_cols=exclude_cols,
                                         fieldsets=self.add_fieldsets,
                                         custom_fields=self.custom_fields,
                                         )
        return widgets

    def pre_add(self, table):
        form = request.form

        hdfs_path = form.get('hdfs_path', None)
        hdfs_file_type = form.get('hdfs_file_type', None)
        hdfs_options = {
            "parquet": "org.apache.spark.sql.parquet",
            "json": "org.apache.spark.sql.json",
        }

        original_table_name = table.table_name.lower()

        create_table_sql = form.get('create_table_sql', None)
        database = db.session.query(Database).get(table.database.id)

        # Check default schema
        schemas = []
        private_roles = [role for role in current_user.roles if role.name not in config.ROBOT_PERMISSION_ROLES]
        private_roles.sort()
        is_admin = False
        for role in current_user.roles:
            if role.name in config.ROLE_CREATE_TABLE_GLOBAL:
                is_admin = True

        for t_database in db.session.query(Database).all():
            for role in private_roles:
                if role in t_database.roles:
                    schemas += [t_database.force_ctas_schema]

        if not is_admin and table.schema not in schemas:
            raise Exception("You are not authorized to access schema {} of database {}".format(table.schema, table.database))

        roles = [role.name for role in current_user.roles]
        # decide create table without username/email account
        create_global_table = len([role for role in roles if role in config.ROLE_CREATE_TABLE_GLOBAL]) > 0
        create_global_table_submit = form.get('create_global_table', None) is not None

        if (database.allow_create_table or database.allow_hdfs_table) and table.table_name is not None and len(table.table_name) > 0 and \
            ((hdfs_path is not None and len(hdfs_path) > 0 and hdfs_file_type is not None and len(hdfs_file_type) > 0) or (create_table_sql is not None and len(create_table_sql) > 0)):
            if not create_global_table or not create_global_table_submit:
                if database.allow_hdfs_table:
                    username = re.sub('[^a-zA-Z0-9]', '_', current_user.username)
                    table.table_name = "{}__{}".format(table.table_name, username)
            table.table_name = re.sub(r"[^A-Za-z0-9_]", "", table.table_name)

        number_of_existing_tables = db.session.query(
            sa.func.count('*')).filter(
            models.SqlaTable.table_name == table.table_name,
            models.SqlaTable.schema == table.schema,
            models.SqlaTable.database_id == table.database.id
        ).scalar()
        # table object is already added to the session
        if number_of_existing_tables > 1:
            raise Exception(get_datasource_exist_error_mgs(table.full_name))

        # Create Table based on HDFS path
        if database.allow_hdfs_table and table.table_name is not None and \
                hdfs_path is not None and len(hdfs_path) > 0 and hdfs_file_type is not None and len(hdfs_file_type) > 0:
            engine = database.get_sqla_engine()
            connection = engine.connect()
            transaction = connection.begin()
            try:
                connection.execute("CREATE TABLE {} USING {} OPTIONS (path \"{}\")".format(table.table_name, hdfs_options[hdfs_file_type], hdfs_path))
                transaction.commit()
            except Exception as e:
                transaction.rollback()
                logging.exception(e)
                raise Exception(
                    "HDFS file [{}] could not be found, "
                    "please double check your "
                    "database connection, and parquet file path".format(hdfs_path))
            finally:
                connection.close()
                engine.dispose()

        elif database.allow_create_table and table.table_name is not None and create_table_sql is not None and len(create_table_sql) > 0:
            engine = database.get_sqla_engine()
            connection = engine.connect()
            transaction = connection.begin()

            clean_sql = utils.clean_sql(create_table_sql, ["CREATE_TABLE"])
            if clean_sql is None:
                raise Exception("Invalid SQL {}".format(create_table_sql))

            if original_table_name not in clean_sql:
                raise Exception("Table name in SQL does not match table name entered in form. {}".format(create_table_sql))
            clean_sql = clean_sql.replace(original_table_name, '{}.{}'.format(table.schema, table.table_name))

            try:
                connection.execute(clean_sql)
                transaction.commit()
            except Exception as e:
                transaction.rollback()
                logging.exception(e)
                raise Exception(
                    "Failed to create table in database. "
                    "Please double check your database connection")
            finally:
                connection.close()
                engine.dispose()

        # Comment to allow user to use existing table from their schema
        # elif not create_global_table:
        #     raise Exception("Insufficient permission to use table in database")

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


    def post_add(self, table, flash_message=True):
        form = request.form
        database = db.session.query(Database).get(table.database.id)
        table.fetch_metadata()

        security.merge_perm(sm, 'datasource_access', table.get_perm())
        if table.schema:
            security.merge_perm(sm, 'schema_access', table.schema_perm)

        # Grant user permission to use this table in Lumos
        permission = sm.find_permission('datasource_access')
        view_menu = sm.find_view_menu(table.get_perm())
        pv = sm.get_session.query(sm.permissionview_model).filter_by(
                permission=permission, view_menu=view_menu).first()
        private_roles = [role for role in current_user.roles if role.name not in config.ROBOT_PERMISSION_ROLES]
        for role in private_roles:
            role.permissions.append(pv)
        db.session.commit()

        create_table_sql = form.get('create_table_sql', None)
        if database.backend == 'postgresql' and database.allow_create_table and create_table_sql is not None and len(create_table_sql) > 0:
            db_users = []
            for t_database in db.session.query(Database).all():
                for role in private_roles:
                    if role in t_database.roles:
                        db_users += [t_database.username]

            engine = database.get_sqla_engine()
            connection = engine.connect()
            transaction = connection.begin()
            try:
                for db_user in db_users:
                    connection.execute("GRANT SELECT ON {}.{} TO {}".format(table.schema, table.table_name, db_user))
                transaction.commit()

            except Exception as e:
                transaction.rollback()
                logging.exception(e)
                if flash_message:
                    flash(_(
                            "Error in granting permission from Redshift. "
                            "Please check with administrator to access to Redshift from your database account. "),
                        "danger")
            finally:
                connection.close()
                engine.dispose()

        if flash_message:
            flash(_(
                "The table was created. "
                "As part of this two phase configuration "
                "process, you should now click the edit button by "
                "the new table to configure it."), "info")

    def post_update(self, table):
        self.post_add(table, flash_message=False)

    @expose('/edit/<pk>', methods=['GET', 'POST'])
    @has_access
    def edit(self, pk):
        """Simple hack to redirect to explore view after saving"""
        resp = super(TableModelView, self).edit(pk)
        if isinstance(resp, basestring):
            return resp
        return redirect('/superset/explore/table/{}/'.format(pk))

    @has_access
    @action("refresh_table_fields", "Refresh table columns", "Fetch changes and add columns/metrics to table?", "fa-refresh")
    def fetch_metadata(self, tables):
        if isinstance(tables, list):
            for table in tables:
                table.fetch_metadata(refresh=True)
        else:
            tables.fetch_metadata(refresh=True)
        return redirect('/tablemodelview/list/')

    @has_access
    @action("upload_data", "Upload data", "Upload data to ONE table",
            "fa-upload")
    def upload_data_action(self, tables):
        if isinstance(tables, list):
            tables = tables[0]
        return redirect('/tablemodelview/upload_data/{}/'.format(tables.id))

    @expose('/upload_data/<pk>/', methods=['GET', 'POST'])
    @has_access
    def upload_data(self, pk):
        table = self.datamodel.get(pk, self._base_filters)
        pk = self.datamodel.get_pk_value(table)
        database = db.session.query(Database).get(table.database.id)

        # If post
        # Check first row
        if 'csv' in request.files:
            f = request.files['csv']
            data = genfromtxt(f, dtype=None, delimiter=',', skip_header=0, converters={0: lambda s: str(s)})

            data_array = data.tolist()
            available_columns = [column.column_name for column in table.columns]
            input_columns = data_array.pop(0)
            columns = []
            for column in input_columns:
                if column not in available_columns:
                    flash(_(
                        "Failed in importing data with error: "
                        "Column %(column) not available in table", column=column),
                        "danger")
                    return redirect('/tablemodelview/upload_data/' + str(pk))
                else:
                    columns.append('"{}"'.format(column))
            columns = ','.join(columns)
            engine = database.get_sqla_engine()
            connection = engine.connect()
            transaction = connection.begin()

            for row in data_array:
                try:
                    data_string = ','.join(["'{}'".format(column.replace("'", "''")) for column in row])
                    sql = "INSERT INTO {}.{} ({}) VALUES ({})".format(table.schema, table.table_name, columns, data_string)
                    connection.execute(sql)
                except Exception as e:
                    transaction.rollback()
                    connection.close()
                    engine.dispose()
                    logging.exception(e)
                    flash(
                        "Failed in importing data with error: {}".format(e),
                        "danger")
                    return redirect('/tablemodelview/upload_data/' + str(pk))

            transaction.commit()
            connection.close()
            engine.dispose()
            flash(_(
                "Data uploaded"),
                "success")
            return redirect('/tablemodelview/list/')
        
        # If get
        # Get table column name
        # Render upload form
        return self.render_template(
            'superset/upload_data.html',
            table=table,
            columns=table.columns,
        )

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
