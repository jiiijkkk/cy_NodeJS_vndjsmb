
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , account = require('./routes/account')
  , board = require('./routes/board')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/', routes.indexReget);
app.get('/login', account.login);
app.post('/login', account.loginReget);
app.post('/loginProcess', account.loginProcess);
app.get('/mb', board.message);
app.post('/mb', board.messageReget);
app.post('/mb/changepagesize', board.changePageSize);
app.post('/mb/changepagenum', board.changePageNum);
app.post('/comment', board.comment);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
