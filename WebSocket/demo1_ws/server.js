const WebSocket = require('ws');
const http = require('http');


// 创建 websocket 服务器
const wss = new WebSocket.Server({
  port: 5432
}, _ => {
  console.log("直接创建： ws://localhost:5432/")
});
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received_1: %s', message);
  });
  ws.send('something_1');
});


// 基于 HTTP/S 服务
const server = http.createServer();
const wss2 = new WebSocket.Server({
  server
});
wss2.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received_2: %s', message);
  });
  ws.send('something_2');
});
server.listen(5433, _ => {
  console.log("基于HTTP服务： ws://localhost:5433/");
});