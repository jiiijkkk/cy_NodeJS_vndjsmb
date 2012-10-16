var libraries = require('../config/libraries.json');
var menu = require('../config/menu.json');

var functions = require('../routes/myModule/functions.js');

exports.indexReget = function(req, res){
    functions.getThemeFromPost(req, res);
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: '/'}
    );
    res.end();
}
 
exports.index = function(req, res){
    
    theme = functions.getThemeFromCookies(req, res);
    
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