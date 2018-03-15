from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from flask_appbuilder.security.views import UserModelView
from flask_babel import lazy_gettext

class MyUserModelView(UserModelView):
    """
        View that add DB specifics to User view.
        Override to implement your own custom view.
        Then override userdbmodelview property on SecurityManager
    """

    show_fieldsets = [
        (lazy_gettext('User info'),
         {'fields': ['username', 'active', 'roles', 'login_count', 'coverage',
                     'function']}),
        (lazy_gettext('Personal Info'),
         {'fields': ['first_name', 'last_name', 'email'], 'expanded': True}),
        (lazy_gettext('Audit Info'),
         {'fields': ['last_login', 'fail_login_count', 'created_on',
                     'created_by', 'changed_on', 'changed_by'],
                     'expanded': False}),
    ]

    user_show_fieldsets = [
        (lazy_gettext('User info'),
         {'fields': ['username', 'active', 'roles', 'login_count',
                     'coverage', 'function']}),
        (lazy_gettext('Personal Info'),
         {'fields': ['first_name', 'last_name', 'email'], 'expanded': True}),
    ]

    add_columns = [ 'first_name', 'last_name', 'username', 'active', 'email',
                    'roles', 'coverage', 'function']
    list_columns = ['first_name', 'last_name', 'username', 'email', 'active',
                    'roles', 'coverage', 'function']
    edit_columns = ['first_name', 'last_name', 'username', 'active', 'email',
                    'roles', 'coverage', 'function']
