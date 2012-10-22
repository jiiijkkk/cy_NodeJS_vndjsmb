var accountModule=  this

  , cookies_config= require('../config/cookies')
  , db_config=      require('../config/database')
  , menu=           require('../config/menu')
  , sessions_config=require('../config/sessions')

  , accountManager=     require('./myModule/accountManager')
  , cookiesManager=     require('./myModule/cookiesManager')
  , sessionsManager=    require('./myModule/sessionsManager')
  , functions=          require('./myModule/functions')

exports.login = function(req, res){
    account = cookiesManager.getCookie(req, res ,cookies_config.messageForm.account);
    if(!account) account = "";

    functions.getErrorMessage(req, function(error){        
        res.render(
            'account/login',
            {
                title:          'Login',
                theme:          functions.getThemeFromCookies(req, res),
                menu:           menu,
                user:           accountManager.getUser(req),
                online_users:   accountManager.getOnlines(),
                
                account:    account,
                error:      error
            }
        );
    });
}

exports.loginReget = function(req, res){
    functions.getThemeFromPost(req, res);
    res.redirect('/login');
}

exports.loginProcess = function(req, res){
    cookiesManager.setCookie(req, res ,cookies_config.messageForm.account, req.body.account);
    accountManager.login(req.body.account, req.body.password, function (account){
        if(account){
            cookiesManager.setCookie(req, res ,cookies_config.messageForm.nickname, account.nickname);
            cookiesManager.removeCookie(req, res ,cookies_config.messageForm.mobile);
            sessionsManager.setSession(req, sessions_config.login_user, account);
            res.redirect('/');
        }
        else{
            sessionsManager.setSession(req, sessions_config.error_message, "Account not existed or password invalid.");
            res.redirect('/login');
        }
    });
}

exports.signup = function(req, res){
    form_value = {
        "account":  cookiesManager.getCookie(req, res, cookies_config.signupForm.account),
        "nickname": cookiesManager.getCookie(req, res, cookies_config.signupForm.nickname)
    }
    cookiesManager.removeCookie(req, res, cookies_config.signupForm.account);
    cookiesManager.removeCookie(req, res, cookies_config.signupForm.nickname);
    if(!form_value.account) form_value.account= "";
    if(!form_value.nickname)form_value.nickname= "";
    
    functions.getErrorMessage(req, function(error){
        res.render(
            'account/signup',
            {
                title:          'Signup',
                theme:          functions.getThemeFromCookies(req, res),
                menu:           menu,
                user:           accountManager.getUser(req),
                online_users:   accountManager.getOnlines(),
                
                form_value: form_value,
                error:      error
            }
        );
    });
}

exports.signupReget = function(req, res){
    functions.getThemeFromPost(req, res);
    res.redirect('/signup');
}

exports.signupProcess = function(req, res){
    cookiesManager.setCookie(req, res, cookies_config.signupForm.account , req.body.account);
    cookiesManager.setCookie(req, res, cookies_config.signupForm.nickname , req.body.nickname);
    
    accountManager.isAccountExisted(req.body.account,function(accountIsExisted){
        if(req.body.password != req.body.password_confirmation){
            sessionsManager.setSession(req, sessions_config.error_message, "Password confirmation invalid.");
            res.redirect('/signup');
        }
        else if(accountIsExisted){
            sessionsManager.setSession(req, sessions_config.error_message, "Account existed.");
            res.redirect('/signup');
        }
        else {
            accountManager.createAccount(req);
            accountModule.loginProcess(req,res);
            cookiesManager.removeCookie(req, res, cookies_config.signupForm.account);
            cookiesManager.removeCookie(req, res, cookies_config.signupForm.nickname);
        }
    });
}

exports.logout = function(req, res){
    sessionsManager.removeSession(req, sessions_config.login_user);
    res.redirect('/');
}

exports.disaccount = function(req, res){
    accountManager.deleteAccount(sessionsManager.getSession(req, sessions_config.login_user).id);
    accountModule.logout(req,res);
}

exports.session = function(req, res){
    var now = (new Date()).valueOf();
    var last_action = sessionsManager.getSession(req, sessions_config.last_action);
    if(accountManager.isLogin(req))
        sessionsManager.setSession(req, sessions_config.last_action, now);
    var timeout = sessions_config.timeout;
    
    if(typeof last_action !== "undefined" &&
            accountManager.isLogin(req) ){
        if(last_action + timeout * 1000 < now){
            sessionsManager.removeSession(req, sessions_config.login_user);
            sessionsManager.removeSession(req, sessions_config.last_action);
            accountManager.deleteOnline();
        }
    }
    if(!accountManager.isLogin(req))
        accountManager.deleteOnline();
    accountManager.session(req);
}