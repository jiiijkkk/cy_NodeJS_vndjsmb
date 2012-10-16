
/*
 * GET home page.
 */

exports.indexReget = function(req, res){    var functions = require('../routes/myModule/functions.js');
    functions.getThemeFromPost(req, res);
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: '/'}
    );
    res.end();
}
 
exports.index = function(req, res){
    var menu = require('../config/menu.json');
    var functions = require('../routes/myModule/functions.js');
    
    theme = functions.getThemeFromCookies(req, res);
    
    var libraries = require('../config/libraries.json');
    res.render(
        'homepage', 
        {
            title:  'Homepage',
            theme:  theme,
            menu:   menu,
            
            libraries: libraries.libraries
        }
    );
};