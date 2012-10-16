exports.messageReget = function(req, res){
    var functions = require('../routes/myModule/functions.js');
    functions.getThemeFromPost(req, res);
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: 'mb'}
    );
    res.end();
};

exports.message = function(req, res){
    var menu = require('../config/menu.json');
    var functions = require('../routes/myModule/functions.js');
    
    theme = functions.getThemeFromCookies(req, res);
    
    var messageManager = require("../routes/myModule/messageManager.js");
    messageManager.getMessages(function(messages){
        for(var i = 0; i < messages.length; i++) {
            var moment = require( 'moment');
            messages[i].time = moment(messages[i].time).format("YYYY/MM/DD hh:mm:ss");
        }
        
        res.render(
            'board'+ '/mb',
            {
                title:  'Message Board',
                theme:  theme,
                menu:   menu,
                
                messages: messages
            }
        );
    });
};

exports.comment = function(req, res){
    var menu = require('../config/menu.json');
    
    var post = req.body;

    //  ADD MESSAGE
    var messageManager = require('../routes/myModule/messageManager.js');
    messageManager.addMessage(req);
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: 'mb'}
    );
    res.end();
    
};
