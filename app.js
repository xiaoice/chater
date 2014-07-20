var express=require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var ejs = require('ejs');
var router = require('./routers/index');
var favicon = require('static-favicon');
var errorhandler = require('errorhandler');
var session = require('express-session');
var cookie = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');

/*app.use(session({
    secret: setting.cookieSecret,
    store: new MongoStore({
        db : setting.db
    })
}));*/

/*app.use(session({
  secret: 'my secret',
  store: new MongoStore({'db': 'chater'})
}));*/

app.use(session({
    secret:setting.cookieSecret,
    key:setting.db,
    cookie:{maxAge:1000*60*60*24*30},
    store:new MongoStore({db:setting.db})
}));

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
//app.use(favicon(path.join(__dirname, '/public/img/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', router);

// development only
if (process.env.NODE_ENV === 'development') {
	 console.log("development");
   app.use(errorhandler())
}


//验证并设置session
/*io.set('authorization', function(handshakeData, callback){
    // 通过客户端的cookie字符串来获取其session数据
    handshakeData.cookie = cookie.cookieParser(handshakeData.headers.cookie)
    var sessionid = handshakeData.cookie['connect.sid'];//这是默认的，可以在app.use(express.session({key:'userid'})的这个key来修改默认
    if (sessionid) {
        //由于cookie保存如下，mongodb保存的_id为sessionID的加密格式，为ypbxGhOzzAQDlsn3mmVGrO6A，获取想要的串就ok
        //s:ypbxGhOzzAQDlsn3mmVGrO6A.9rtRxhQu3r8ymOZ1s%2FzlfEWaZ9MSorSBobzy8CNhjh0
        var sid = '';
        if(sessionid)
        {
            sid =  sessionid.split(':')[1].split('.')[0];
        }
        sessionStore.get(sid, function(error, session){
            if (error) {
                // if we cannot grab a session, turn down the connection
                callback(error.message, false);
            }
            else {
                //console.log('session,',session)
                // save the session data and accept the connection
                handshakeData.session = session;
                callback(null, true);
            }
        });
    }
    else {
        callback('nosession');
    }
});*/

io.on('connection', function (socket) {
  socket.emit('connectionok', "socket 连接成功");

  socket.on('login', function (data) {
    if(data.type==="login"){
    app.set("username",data.name);
    console.log(data.name+data.text);
    }
    socket.broadcast.emit('msgList', data);
  });

  socket.on('send', function (data) {
  	if(data.type==="login"){
		app.set("username",data.name);
		console.log(data.name+data.text);
  	}
  	socket.broadcast.emit('msgList', data);
  });

  socket.on('disconnect', function (data) {
  		var data={
	  		type:"loginout"
	  		,name:app.get("username")
	  		,text:"离开了聊天室"
	  		,time:new Date().toLocaleString()
  		}
  		console.log(data.name+data.text);
  		app.set("username",undefined);
  		socket.broadcast.emit('msgList', data);
  });
});

server.listen(app.get('port'),function(){
	console.log("server was started!");
});