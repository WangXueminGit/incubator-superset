"""Package's main module!"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import logging
import os
import json
from logging.handlers import TimedRotatingFileHandler

from flask import Flask, redirect
from flask_appbuilder import SQLA, AppBuilder, IndexView
from flask_appbuilder.baseviews import expose
# from flask import flash, session
# from flask_appbuilder._compat import as_unicode
# from flask_appbuilder.security.manager import BaseSecurityManager
# from flask_appbuilder.security.views import AuthOAuthView
# from flask_login import login_user
from flask_migrate import Migrate
from superset.connectors.connector_registry import ConnectorRegistry
# from superset.utils import SupersetSecurityException
from werkzeug.contrib.fixers import ProxyFix
from superset import utils, config  # noqa


APP_DIR = os.path.dirname(__file__)
CONFIG_MODULE = os.environ.get('SUPERSET_CONFIG', 'superset.config')

with open(APP_DIR + '/static/assets/backendSync.json', 'r') as f:
    frontend_config = json.load(f)


app = Flask(__name__)
app.config.from_object(CONFIG_MODULE)
conf = app.config

for bp in conf.get('BLUEPRINTS'):
    try:
        print("Registering blueprint: '{}'".format(bp.name))
        app.register_blueprint(bp)
    except Exception as e:
        print("blueprint registration failed")
        logging.exception(e)

if conf.get('SILENCE_FAB'):
    logging.getLogger('flask_appbuilder').setLevel(logging.ERROR)

if not app.debug:
    # In production mode, add log handler to sys.stderr.
    app.logger.addHandler(logging.StreamHandler())
    app.logger.setLevel(logging.INFO)
logging.getLogger('pyhive.presto').setLevel(logging.INFO)

db = SQLA(app)


utils.pessimistic_connection_handling(db.engine.pool)

cache = utils.setup_cache(app, conf.get('CACHE_CONFIG'))
tables_cache = utils.setup_cache(app, conf.get('TABLE_NAMES_CACHE_CONFIG'))

migrate = Migrate(app, db, directory=APP_DIR + "/migrations")

# Logging configuration
logging.basicConfig(format=app.config.get('LOG_FORMAT'))
logging.getLogger().setLevel(app.config.get('LOG_LEVEL'))

if app.config.get('ENABLE_TIME_ROTATE'):
    logging.getLogger().setLevel(app.config.get('TIME_ROTATE_LOG_LEVEL'))
    handler = TimedRotatingFileHandler(app.config.get('FILENAME'),
                                       when=app.config.get('ROLLOVER'),
                                       interval=app.config.get('INTERVAL'),
                                       backupCount=app.config.get('BACKUP_COUNT'))
    logging.getLogger().addHandler(handler)

if app.config.get('ENABLE_CORS'):
    from flask_cors import CORS
    CORS(app, **app.config.get('CORS_OPTIONS'))

if app.config.get('ENABLE_PROXY_FIX'):
    app.wsgi_app = ProxyFix(app.wsgi_app)

if app.config.get('UPLOAD_FOLDER'):
    try:
        os.makedirs(app.config.get('UPLOAD_FOLDER'))
    except OSError:
        pass

for middleware in app.config.get('ADDITIONAL_MIDDLEWARE'):
    app.wsgi_app = middleware(app.wsgi_app)


class MyIndexView(IndexView):
    @expose('/')
    def index(self):
        return redirect('/superset/welcome')


# log = logging.getLogger(__name__)
#
#
# class CustomAuthOAuthView(AuthOAuthView):
#
#     @expose('/oauth-authorized/<provider>')
#     def oauth_authorized(self, provider):
#         log.debug("Authorized init")
#         resp = self.appbuilder.sm.oauth_remotes[provider].authorized_response()
#         if resp is None:
#             flash(u'You denied the request to sign in.', 'warning')
#             return redirect('login')
#         log.debug('OAUTH Authorized resp: {0}'.format(resp))
#         # Retrieves specific user info from the provider
#         try:
#             self.appbuilder.sm.set_oauth_session(provider, resp)
#             userinfo = self.appbuilder.sm.oauth_user_info(provider)
#             log.debug("User info retrieved from {0}: {1}".format(provider, userinfo))
#         except SupersetSecurityException as e:
#             log.error("Error returning OAuth user info: {0}".format(e))
#             flash(as_unicode(e), 'warning')
#             return redirect('login')
#         except Exception as e:
#             log.error("Error returning OAuth user info: {0}".format(e))
#         # Is this Authorization to register a new user ?
#         if session.pop('register', None):
#             return redirect(self.appbuilder.sm.registeruseroauthview.get_default_url(**userinfo))
#         user = self.appbuilder.sm.auth_user_oauth(userinfo)
#         if user is None:
#             flash(as_unicode(self.invalid_login_message), 'warning')
#             return redirect('login')
#         else:
#             login_user(user)
#             return redirect(self.appbuilder.get_url_for_index)
#
#
# class CustomSecurityManager(BaseSecurityManager):
#     AuthOAuthView = CustomAuthOAuthView

appbuilder = AppBuilder(
    app, db.session,
    base_template='superset/base.html',
    indexview=MyIndexView,
    security_manager_class=app.config.get("CUSTOM_SECURITY_MANAGER"))

sm = appbuilder.sm

get_session = appbuilder.get_session
results_backend = app.config.get("RESULTS_BACKEND")

# Registering sources
module_datasource_map = app.config.get("DEFAULT_MODULE_DS_MAP")
module_datasource_map.update(app.config.get("ADDITIONAL_MODULE_DS_MAP"))
ConnectorRegistry.register_sources(module_datasource_map)

from superset import views  # noqa
