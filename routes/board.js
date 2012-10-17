var menu = require('../config/menu')

  , accountManager= require('./myModule/accountManager')
  , messageManager= require('./myModule/messageManager')
  , functions=      require('./myModule/functions')

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
                    user:   accountManager.getUser(req),
                    
                    default_info:   default_info,
                    messages:       messages
                }
            );
        });
    });
};

exports.messageReget = function(req, res){
    functions.getThemeFromPost(req, res);
    res.redirect('/mb');
};

exports.changePageSize = function(req, res){
    functions.setMessagePageInfoFromPost(req, res, {
        "size": req.body.pagesize,
        "num":  0
    });
    res.redirect('/mb');
}

exports.changePageNum = function(req, res){
    info = functions.getMessageFormAndPageInfoFromCookies(req, res);
    functions.setMessagePageInfoFromPost(req, res, {
        "size": info.pagesize,
        "num":  req.body.pagenum
    });
    res.redirect('/mb');
}

exports.comment = function(req, res){
    messageManager.addMessage(req);
    functions.setMessageFormFromPost(req, res);
    res.redirect('/mb');
};
