exports.getClient = function (db_config){
    var mysql = require('mysql');
    var client = mysql.createClient({
        user:       db_config.username,
        password:   db_config.password
    });
    return client;
};
