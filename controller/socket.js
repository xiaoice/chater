  var socket = require('socket.io');

  module.exports=function(app,server){
    var io=socket(server);

    /*//验证并设置session
    io.set('authorization', function(handshakeData, callback){
      // 通过客户端的cookie字符串来获取其session数据
      //handshakeData.cookie = cookie.cookieParser(handshakeData.headers.cookie)
      handshakeData.cookie = cookie.parse(handshakeData.headers.cookie)
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

    //登录系统
    socket.on('login', function (data) {
      app.locals.onlines.forEach(function(item,i,arr){
        if(data.openId==item.openId){
          arr.splice(i,1);
        }
      })
      app.locals.onlines.push(data);
      console.log(data.nickname+"上线了");
      socket.broadcast.emit('login', data);
    });

    //退出登录
    socket.on('loginOut', function (data) {
      app.locals.onlines.forEach(function(item,i,arr){
        if(data.openId==item.openId){
          arr.splice(i,1);
        }
      })
      socket.broadcast.emit('loginOut', data);
    });

    //进入房间
    socket.on('joinRoom', function (data) {
      socket.join(data.receiveId);
      console.log(data.nickname+"进入了房间，房间号："+data.receiveId);
    });

    //发送消息
    socket.on('sendRoomMessage', function (data) {
      console.log(data.nickname+"发送了一条消息，房间号："+data.openId);
      io.sockets.in(data.openId).emit('message', data);
      io.sockets.in(data.receiveId).emit('message', data);
      //socket.broadcast.emit(data.receiveId, data);
      //socket.broadcast.to("10000").emit('message', data);
    });


    socket.on('send', function (data) {
    	socket.broadcast.emit('msgList', data);
    });

    socket.on('disconnect', function (data) {
    		socket.broadcast.emit('msgList', data);
    });
  });

}