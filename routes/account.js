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
    if(accountManager.isLogin(req)){
        res.redirect('/');
    } else {
        var theme = functions.getThemeFromCookies(req, res);
        
        account = cookiesManager.getCookie(req, res ,cookies_config.messageForm.account);
        if(!account) account = "";

        functions.getErrorMessage(req, function(error){        
            res.render(
                'account/login',
                {
                    title:  'Login',
                    theme:  theme,
                    menu:   menu,
                    user:   accountManager.getUser(req),
                    
                    account:    account,
                    error:      error
                }
            );
        });
    }
}

exports.loginReget = function(req, res){
    if(accountManager.isLogin(req)){
        res.redirect('/');
    } else {
        functions.getThemeFromPost(req, res);
        res.redirect('/login');
    }
}

exports.loginProcess = function(req, res){
    if(accountManager.isLogin(req)){
        res.redirect('/');
    } else {
        cookiesManager.setCookie(req, res ,cookies_config.messageForm.account, req.body.account);
        accountManager.login(req.body.account, req.body.password, function (account){
            if(account){
                cookiesManager.setCookie(req, res ,cookies_config.messageForm.nickname, account.nickname);
                cookiesManager.setCookie(req, res ,cookies_config.messageForm.mobile, 0);
                sessionsManager.setSession(req, sessions_config.login_user, account);
                res.redirect('/');
            }
            else{
                sessionsManager.setSession(req, sessions_config.error_message, "Account not existed or password invalid.");
                res.redirect('/login');
            }
        });
    }
}

exports.signup = function(req, res){
    if(accountManager.isLogin(req)){
        res.redirect('/');
    } else {
        var theme = functions.getThemeFromCookies(req, res);
        
        form_value = {
            "account":  cookiesManager.getCookie(req, res, cookies_config.signupForm.account),
            "nickname": cookiesManager.getCookie(req, res, cookies_config.signupForm.nickname)
        }
        cookiesManager.setCookie(req, res, cookies_config.signupForm.account, 0);
        cookiesManager.setCookie(req, res, cookies_config.signupForm.nickname, 0);
        if(!form_value.account) form_value.account= "";
        if(!form_value.nickname)form_value.nickname= "";
        
        functions.getErrorMessage(req, function(error){
            res.render(
                'account/signup',
                {
                    title:  'Signup',
                    theme:  theme,
                    menu:   menu,
                    user:   accountManager.getUser(req),
                    
                    form_value: form_value,
                    error:      error
                }
            );
        });
    }
}

exports.signupReget = function(req, res){
    if(accountManager.isLogin(req)){
        res.redirect('/');
    } else {
        functions.getThemeFromPost(req, res);
        res.redirect('/signup');
    }
}

exports.signupProcess = function(req, res){
    if(!accountManager.isLogin(req)){
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
                cookiesManager.setCookie(req, res, cookies_config.signupForm.account , 0);
                cookiesManager.setCookie(req, res, cookies_config.signupForm.nickname , 0);
            }
        });
    }
    else res.redirect('/');
}

exports.logout = function(req, res){
    sessionsManager.removeSession(req, sessions_config.login_user);
    res.redirect('/');
}

exports.disaccount = function(req, res){
    accountManager.deleteAccount(sessionsManager.getSession(req, sessions_config.login_user).id);
    accountModule.logout(req,res);
}
    