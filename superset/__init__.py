"""Package's main module!"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import logging
from logging.handlers import TimedRotatingFileHandler

import json
import os

from flask import g
from flask import Flask, redirect, request
from flask_appbuilder import SQLA, AppBuilder, IndexView
from flask_appbuilder.baseviews import expose
from flask_appbuilder.security.sqla.manager import SecurityManager
from flask_appbuilder.security.views import AuthOAuthView as DefaultAuthOAuthView, UserInfoEditView
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from werkzeug.contrib.fixers import ProxyFix

from superset.connectors.connector_registry import ConnectorRegistry
from superset import utils, config  # noqa
from superset.users_model import MyUser
from superset.users_view import MyUserModelView

APP_DIR = os.path.dirname(__file__)
CONFIG_MODULE = os.environ.get('SUPERSET_CONFIG', 'superset.config')

with open(APP_DIR + '/static/assets/backendSync.json', 'r') as f:
    frontend_config = json.load(f)


app = Flask(__name__)
app.config.from_object(CONFIG_MODULE)
conf = app.config

@app.before_request
def before_request():
    # When you import jinja2 macros, they get cached which is annoying for local
    # development, so wipe the cache every request.
    if 'localhost' in request.host_url or '0.0.0.0' in request.host_url:
        app.jinja_env.cache = {}

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
else:
    app.jinja_env.auto_reload = True
logging.getLogger('pyhive.presto').setLevel(logging.INFO)

db = SQLA(app)

if conf.get('WTF_CSRF_ENABLED'):
    csrf = CSRFProtect(app)

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

class MyUserInfoEditView(UserInfoEditView):
    def form_get(self, form):
        item = self.appbuilder.sm.get_user_by_id(g.user.id)
        # fills the form generic solution
        for key, value in  form.data.items():
            if key == 'csrf_token': continue
            form_field = getattr(form, key)
            form_field.data = getattr(item, key)


class AuthOAuthView(DefaultAuthOAuthView):
    # Forced redirect to Google Login
    @expose('/login/')
    def auto_login(self):
        return redirect('/login/google')


class CustomSecurityManager(SecurityManager):
    authoauthview = AuthOAuthView
    user_model = MyUser
    useroauthmodelview = MyUserModelView
    userinfoeditview = MyUserInfoEditView


appbuilder = AppBuilder(
    app, db.session,
    base_template='superset/base.html',
    indexview=MyIndexView,
    security_manager_class=CustomSecurityManager
)

sm = appbuilder.sm

get_session = appbuilder.get_session
results_backend = app.config.get("RESULTS_BACKEND")

# Registering sources
module_datasource_map = app.config.get("DEFAULT_MODULE_DS_MAP")
module_datasource_map.update(app.config.get("ADDITIONAL_MODULE_DS_MAP"))
ConnectorRegistry.register_sources(module_datasource_map)

sm.get_session.close()

from superset import views  # noqa
