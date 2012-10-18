var libraries=      require('../config/libraries')
  , menu=           require('../config/menu')

  , accountManager= require('./myModule/accountManager')
  , functions=      require('./myModule/functions')


exports.index = function(req, res){
    res.render(
        'homepage', 
        {
            title:          'Homepage',
            theme:          functions.getThemeFromCookies(req, res),
            menu:           menu,
            user:           accountManager.getUser(req),
            online_users:   accountManager.getOnlines(),
            
            libraries: libraries.libraries
        }
    );
};

exports.indexReget = function(req, res){
    functions.getThemeFromPost(req, res);
    
    res.redirect('/');
}