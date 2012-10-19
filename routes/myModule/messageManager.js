var db_config = require('../../config/database')
  , databaseManager = require('./databaseManager')
  , client = databaseManager.getClient(db_config);
client.query('USE '+ db_config.database);

exports.getMessages = function(pagesize, pagenum, callback){
    var start_seq= (pagenum-1)*pagesize;
    client.query(
        'SELECT * FROM '+ db_config.messages+
        ' ORDER BY time DESC'+
        ' LIMIT '+ start_seq+ ','+ pagesize,
        function selectCb(err, messages, fields) {
            if (err) {
                throw err;
            }
            callback(messages);
        }
    );
};

exports.getMessageMax = function(callback){
    client.query(
    'SELECT * FROM '+ db_config.messages,
        function selectCb(err, messages, fields) {
            if (err) {
                throw err;
            }
            callback(messages.length);
        }
    )
};

exports.getPageMax = function(pagesize, callback){
    this.getMessageMax(function(messagemax){
        callback(Math.ceil(messagemax/pagesize));
    });
};

exports.addMessage = function (req){
    var functions = require('./functions.js');
    
    var post = req.body;
    var time = functions.getNow();
    var ip = functions.getClientIP(req);
    
    client.query(
        "INSERT INTO "+ db_config.messages+
        " (id, account, nickname, mobile, title, contant, time, ip) VALUES"+
        " ('"+
            (id+ 1)+        "', '"+
            post.account+   "', '"+
            post.nickname+  "', '"+
            post.mobile+    "', '"+
            post.title+     "', '"+
            post.contant+   "', '"+
            time+           "', '"+
            ip+
        "')"
    );
};

exports.deleteMessage = function (req){
    var functions = require('./functions.js');
    
    client.query(
        "DELETE FROM "+ db_config.messages+
        " WHERE id = "+ req.params.id
    );
};