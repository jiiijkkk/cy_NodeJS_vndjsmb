var db_config = require('../../config/database')

  , databaseManager = require('./databaseManager')
  , client = databaseManager.getClient(db_config);

    client.query('USE '+ db_config.database);

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