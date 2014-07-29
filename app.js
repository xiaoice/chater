var express=require('express');
var app = express();
var server = require('http').Server(app);
require('./controller/socket')(app,server);
var path = require('path');
var ejs = require('ejs');
var router = require('./routers/loginAction');
var errorhandler = require('errorhandler');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


/*app.use(session({
    secret: setting.cookieSecret,
    store: new MongoStore({
        db : setting.db
    })
}));*/

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret:setting.cookieSecret,
    key:setting.db,
    cookie:{maxAge:1000*60*60*24*30},
    store:new MongoStore({db:setting.db})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

//获取在线人数
router.get('/onlines.do', function (req, res) {
  var result=app.locals.onlines.map(function(item){
    if(req.session.user.openId!==item.openId){
      return item;
    }
  });
  res.json(result);
});

// development only
if (process.env.NODE_ENV === 'development') {
	 console.log("development");
   app.use(logger('dev'));
   app.use(errorhandler())
}

server.listen(app.get('port'),function(){
	console.log("server was started!");
  app.locals.onlines=[];
});