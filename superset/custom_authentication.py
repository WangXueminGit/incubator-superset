import re
import ast
import logging
from flask_appbuilder.security.views import AuthOAuthView
from flask import g, redirect, session, url_for, flash, request
from flask_appbuilder._compat import as_unicode
from flask_appbuilder.views import expose
from flask_login import login_user

log = logging.getLogger(__name__)

class CustomAuthOauthView(AuthOAuthView):
    @expose('/login/')
    @expose('/login/<provider>')
    @expose('/login/<provider>/<register>')
    def login(self, provider=None, register=None):
        return_url = request.args.get('next')
        log.debug('Provider: {0}'.format(provider))
        if g.user is not None and g.user.is_authenticated():
            log.debug("Already authenticated {0}".format(g.user))
            if return_url:
                return redirect(return_url)
            return redirect(self.appbuilder.get_url_for_index)
        if provider is None:
            return self.render_template(self.login_template,
                               providers = self.appbuilder.sm.oauth_providers,
                               title=self.title,
                               appbuilder=self.appbuilder)
        else:
            log.debug("Going to call authorize for: {0}".format(provider))
            try:
                if register:
                    log.debug('Login to Register')
                    session['register'] = True
                if return_url:
                    return self.appbuilder.sm.oauth_remotes[provider].authorize(callback=url_for('.oauth_authorized',provider=provider,_external=True), state={"return_url": return_url})
                return self.appbuilder.sm.oauth_remotes[provider].authorize(callback=url_for('.oauth_authorized',provider=provider,_external=True))
            except Exception as e:
                log.error("Error on OAuth authorize: {0}".format(e))
                flash(as_unicode(self.invalid_login_message), 'warning')
                return redirect(self.appbuilder.get_url_for_index)

    @expose('/oauth-authorized/<provider>')
    def oauth_authorized(self, provider):
        state = None
        return_url = None
        if request.args.get('state'):
            state = ast.literal_eval(request.args.get('state'))
        if state and isinstance(state, dict):
            return_url = state.get('return_url')
        log.debug("Authorized init")

        try:
            resp = self.appbuilder.sm.oauth_remotes[provider].authorized_response()
        except Exception as e:
            if return_url:
                return redirect('/login/' + provider + '?next=' + return_url)
            return redirect('/login/' + provider)

        if resp is None:
            flash(u'You denied the request to sign in.', 'warning')
            return redirect('login')
        log.debug('OAUTH Authorized resp: {0}'.format(resp))
        # Retrieves specific user info from the provider
        try:
            self.appbuilder.sm.set_oauth_session(provider, resp)
            userinfo = self.appbuilder.sm.oauth_user_info(provider)
        except Exception as e:
            log.error("Error returning OAuth user info: {0}".format(e))
            user = None
        else:
            log.debug("User info retrieved from {0}: {1}".format(provider, userinfo))
            # User email is not whitelisted
            if provider in self.appbuilder.sm.oauth_whitelists:
                whitelist = self.appbuilder.sm.oauth_whitelists[provider]
                allow = False
                for e in whitelist:
                    if re.search(e, userinfo['email']):
                        allow = True
                        break
                if not allow:
                    flash(u'You are not authorized.', 'warning')
                    return redirect('login')
            else:
                log.debug('No whitelist for OAuth provider')
            user = self.appbuilder.sm.auth_user_oauth(userinfo)

        if user is None:
            flash(as_unicode(self.invalid_login_message), 'warning')
            return redirect('login')
        else:
            login_user(user)
            if return_url:
                return redirect('/?next=' + return_url)
            else:
                return redirect(self.appbuilder.get_url_for_index)
