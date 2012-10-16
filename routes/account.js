var menu = require('../config/menu')

  , functions = require('../routes/myModule/functions');

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
    
    res.render(
        'account/login',
        {
            title:  'Login',
            theme:  theme,
            menu:   menu
        }
    );
}

exports.loginProcess = function(req, res){
}