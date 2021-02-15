const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const fs = require('fs');

// 普通的 http 服务器
const server = http.createServer((req, res) => {
  let data = fs.readFileSync('./index.html');
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.end(data);
});
const wss = new WebSocket.Server({
  noServer: true // 不启用服务器模式
});


// 当 websocket 被连接时
let once = false;
wss.on('connection', ws => {
  console.log("-------- 连接完成 --------");
  // ws 是已连接的 websocket 
  // 监听客户端发送过来的消息
  ws.onmessage = e => {
    console.log("接收到客户端的消息：", e.data);
    if (once) return;
    // 定时发送消息
    setInterval(() => {
      // 发送消息
      ws.send("bazzzzzzzzzz" + Math.random());
    }, 2000);
    once = true;
  }
  // 监听连接断开
  ws.onclose = e => {
    console.log("-------- 连接已断开 --------");
  }
});


// 当客户端连接升级为 websocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});


server.listen(4321, _ => {
  console.log("http://localhost:4321");
});