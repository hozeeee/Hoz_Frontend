const WebSocket = require('ws');

function heartbeat() {
  clearTimeout(this.pingTimeout);
  // 延迟应该等于服务器发出ping信号的时间间隔加上对延迟的保守假设
  this.pingTimeout = setTimeout(() => {
    // 销毁连接
    this.terminate();
  }, 30000 + 1000);
}
const client = new WebSocket('wss://echo.websocket.org/');
client.on('open', heartbeat);
client.on('ping', heartbeat);
client.on('close', function clear() {
  clearTimeout(this.pingTimeout);
});
