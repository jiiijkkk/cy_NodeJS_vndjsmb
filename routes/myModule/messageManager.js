var db_config = require('../../config/database.json');
var databaseManager = require('./databaseManager.js');
client = databaseManager.getClient(db_config);
client.query('USE '+ db_config.database);

exports.getMessages = function(callback){
    client.query(
        'SELECT * FROM '+ db_config.messages+
        ' ORDER BY time DESC',
        function selectCb(err, messages, fields) {
            if (err) {
                throw err;
            }
            callback(messages);
        }
    );
};

exports.getLastMessageID = function (callback){
    client.query(
        'SELECT * FROM '+db_config.messages+
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
            " ('"+ (id+ 1)+ "', '"+ post.account+ "', '"+ post.nickname+ "', '"+ post.mobile+ "', '"+ post.title+ "', '"+ post.contant+ "', '"+ time+ "', '"+ ip+"')"
        )
    });
};