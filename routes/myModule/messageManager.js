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

exports.getLastMessageID = function (callback){
    client.query(
        'SELECT id FROM '+db_config.messages+
        ' ORDER BY id DESC'+
        ' LIMIT 0,1',
        function selectCb(err, ids, fields) {
            if (err) {
                throw err;
            }
            callback(ids[0].id);
        }
    )
};

exports.addMessage = function (req){
    var functions = require('./functions.js');
    
    var post = req.body;
    var time = functions.getNow();
    var ip = functions.getClientIP(req);
    
    this.getLastMessageID(function (id){
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
        )
    });
};