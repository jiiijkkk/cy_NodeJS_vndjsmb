var libraries=  require('../config/libraries')
  , menu=       require('../config/menu')

  , functions=  require('../routes/myModule/functions');

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