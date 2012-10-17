var cookies_config= require('../config/cookies')
  , db_config=      require('../config/database')
  , menu=           require('../config/menu')

  , accountManager=     require('./myModule/accountManager')
  , cookiesManager=     require('./myModule/cookiesManager')
  , sessionsManager=    require('./myModule/sessionsManager')
  , functions=          require('./myModule/functions')
  
exports.loginReget = function(req, res){
    functions.getThemeFromPost(req, res);
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: 'login'}
    );
    res.end();
}

exports.login = function(req, res){
    var theme = functions.getThemeFromCookies(req, res);
    
    account = cookiesManager.getCookie(req, res ,cookies_config.messageForm.account);
    if(!account) account = "";
    
    res.render(
        'account/login',
        {
            title:  'Login',
            theme:  theme,
            menu:   menu,
            
            account:    account
        }
    );
}

exports.loginProcess = function(req, res){
    accountManager.login(req.body.account, req.body.password, function (account){
        if(account){
            sessionsManager.setSession(req, res);
            cookiesManager.setCookie(req, res, cookies_config.messageForm.account, req.body.account);
        }    
        //  REDIRECT TO MESSAGE BOARD
        res.writeHead(301,
            {Location: '/login'}
        );
        res.end();
    });
}