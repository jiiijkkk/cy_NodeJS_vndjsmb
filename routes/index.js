var libraries=      require('../config/libraries')
  , menu=           require('../config/menu')

  , accountManager= require('./myModule/accountManager')
  , functions=      require('./myModule/functions')
 
exports.index = function(req, res){
    theme = functions.getThemeFromCookies(req, res);
    
    res.render(
        'homepage', 
        {
            title:  'Homepage',
            theme:  theme,
            menu:   menu,
            user:   accountManager.getUser(req),
            
            libraries: libraries.libraries
        }
    );
};

exports.indexReget = function(req, res){
    functions.getThemeFromPost(req, res);
    
    res.redirect('/');
}