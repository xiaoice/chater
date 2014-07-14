var express=require('express');
var path=require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
console.log("server was started!");

app.use(express.static(path.join(__dirname)));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/app.html');
});

io.on('connection', function (socket) {
  socket.emit('connectionok', "socket 连接成功");
  socket.on('send', function (data) {
  	console.log(data);
  	socket.broadcast.emit('msgList', data);
  });
});