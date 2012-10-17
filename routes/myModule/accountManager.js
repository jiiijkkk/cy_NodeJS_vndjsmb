var db_config=          require('../../config/database')
  , sessions_config=    require('../../config/sessions')

  , databaseManager=    require('./databaseManager')
  , sessionsManager=    require('./sessionsManager')
  
  , client = databaseManager.getClient(db_config)

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
