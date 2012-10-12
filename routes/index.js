
/*
 * GET home page.
 */

exports.index = function(req, res){
    var menu = require('../config/menu.json');
    res.render(
        'homepage', 
        {
            title:  'Homepage',
            theme:  'Default',
            menu:   menu
        }
    );
};