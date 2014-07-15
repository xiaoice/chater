var express=require('express');
var path=require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
console.log("server was started!");

app.use(express.static(path.join(__dirname)));

app.get('/app.html', function (req, res) {
  res.sendfile(__dirname + '/app.html');
});

io.on('connection', function (socket) {
  socket.emit('connectionok', "socket 连接成功");
  var cache_name=undefined;

  socket.on('send', function (data) {
  	if(data.type==="login"){
		cache_name=data.name;
		console.log(data.name+data.text);
  	}
  	socket.broadcast.emit('msgList', data);
  });

  socket.on('disconnect', function (data) {
  		var data={
	  		type:"loginout"
	  		,name:cache_name
	  		,text:"离开了聊天室"
	  		,time:new Date().toLocaleString()
  		}
  		cache_name=undefined;
  		socket.broadcast.emit('msgList', data);
  		console.log(data.name+data.text);
  });


});