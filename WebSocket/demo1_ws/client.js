const WebSocket = require('ws');

(async function _() {

  // 连接目标 websocket
  const ws = new WebSocket('ws://localhost:5432');

  ws.on('open', function open() {
    ws.send(Math.random());
  });
  ws.onmessage = e => {
    console.log('received_1: %s', e.data)
  }

  const ws2 = new WebSocket('ws://localhost:5433');

  ws2.on('open', function open() {
    ws2.send(Math.random());
  });
  ws2.onmessage = e => {
    console.log('received_2: %s', e.data)
  }

})()