var db_config=          require('../../config/database')
  , sessions_config=    require('../../config/sessions')

  , databaseManager=    require('./databaseManager')
  , sessionsManager=    require('./sessionsManager')
  
  , client = databaseManager.getClient(db_config)

client.query('SET NAMES utf8');
client.query('USE '+ db_config.database);

exports.getUser = function (req){
    return sessionsManager.getSession(req, sessions_config.login_user);
}

exports.isLogin = function (req){
    if(typeof this.getUser(req) === "undefined")return false;
    return true;
}
    
exports.login = function (account, password, callback) {
    client.query(
        "SELECT * FROM "+ db_config.accounts+
        " WHERE account = '"+ account+ "'"+
        " AND password = '"+ password+ "'",
        function selectCb(err, accounts, fields) {
            if (err) {
                throw err;
            }
            callback(accounts[0]);
        }
    );
}
exports.isAccountExisted = function(account, callback){
    client.query(
        "SELECT account FROM "+ db_config.accounts+
        " WHERE account = '"+ account+ "'",
        function selectCb(err, accounts, fields) {
            if (err) {
                throw err;
            }
            if(typeof accounts[0] === "undefined"){
                callback(false);
            }
            else callback(true);
        }
    );
}

exports.createAccount = function(req){
    var post = req.body
    client.query(
        "INSERT INTO "+ db_config.accounts+
        " (account, nickname, password) VALUES"+
        " ('"+
            post.account+   "' ,'"+
            post.nickname+  "' ,'"+
            post.password+
        "')",
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
        }
    );
}

exports.deleteAccount = function(id){
    client.query(
        "DELETE FROM "+ db_config.accounts+
        " WHERE id = "+ id,
        function selectCb(err, results, fields){
            if(err){
                throw err;
            }
        }
    );
    
}

var onlines = {};
exports.session = function (req){
    var now = new Date();
    for ( var i in onlines ){
        if(onlines[i].time.valueOf() + sessions_config.timeout*1000 < now)
            delete onlines[i];
    }
    onlines[req.sessionID] = {
        user:   this.getUser(req),
        time:   now
    }
}

exports.deleteOnline = function (sid){
    delete onlines[sid];
}

exports.getOnlines = function (){
    var online_accounts = {}
    for ( var i in onlines ){
        if(typeof onlines[i].user !== "undefined"){
            online_accounts[onlines[i].user.id] = {
                "account":  onlines[i].user.account,
                "nickname": onlines[i].user.nickname
            }
        }
    }
    return online_accounts;
}
