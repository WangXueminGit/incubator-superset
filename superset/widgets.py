from flask_appbuilder.widgets import FormWidget


class CustomFormWidget(FormWidget):
    template = 'superset/add_table.html'
