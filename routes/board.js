var menu = require('../config/menu')

  , functions = require('../routes/myModule/functions')
  , messageManager = require('../routes/myModule/messageManager');

exports.messageReget = function(req, res){
    functions.getThemeFromPost(req, res);
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: 'mb'}
    );
    res.end();
};

exports.message = function(req, res){
    var theme = functions.getThemeFromCookies(req, res);
    
    var default_info = functions.getMessageFormAndPageInfoFromCookies(req, res);
    
    messageManager.getMessages(default_info.pagesize, default_info.pagenum, function(messages){
        for(var i = 0; i < messages.length; i++) {
            var moment = require( 'moment');
            messages[i].time = moment(messages[i].time).format("YYYY/MM/DD HH:mm:ss");
        }
        
        messageManager.getPageMax(default_info.pagesize, function(pagemax){
            default_info.pagemax= pagemax;
            res.render(
                'board'+ '/mb',
                {
                    title:  'Message Board',
                    theme:  theme,
                    menu:   menu,
                    
                    default_info:   default_info,
                    messages:       messages
                }
            );
        });
    });
};

exports.changePageSize = function(req, res){
    functions.setMessagePageInfoFromPost(req, res, {
        "size": req.body.pagesize,
        "num":  0
    });
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: '/mb'}
    );
    res.end();
}

exports.changePageNum = function(req, res){
    info = functions.getMessageFormAndPageInfoFromCookies(req, res);
    functions.setMessagePageInfoFromPost(req, res, {
        "size": info.pagesize,
        "num":  req.body.pagenum
    });
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: '/mb'}
    );
    res.end();
}

exports.comment = function(req, res){
    //  ADD MESSAGE
    messageManager.addMessage(req);
    
    //  SET COOKIES
    functions.setMessageFormFromPost(req, res);
    
    //  REDIRECT TO MESSAGE BOARD
    res.writeHead(301,
        {Location: 'mb'}
    );
    res.end();
    
};
