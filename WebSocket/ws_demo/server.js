// 第三方库 (此模块不能用于浏览器)
const Ws = require('ws');

const ws = new Ws.Server({
  port: 8000,
  // 资源压缩 (服务端默认关闭;客户端默认开启.内存消耗比较高)
  // 除了这里的介绍，还有更多选项，请查阅官网
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10, // 限制perf的zlib并发
    threshold: 1024 // 高于此值才压缩 (单位:字节)
  }
}, () => {
  console.log('socket start!');
});
// 【广播消息】可以创建一个 client 数组，存放所有连接的用户，
let clients = []
// 监听事件
ws.on('connection', (client) => {
  client.send('hello'); // 只能发送字符串
  client.on('message', msg => {
    // 接收数据时...
  });
  client.on('close', () => {
    // 客户端连接关闭时...
  })

})



// 轮询检测客户端是否断开 (每半分钟)
setInterval(function ping() {
  ws.clients.forEach(function each(client) {
    if (client.isAlive === false) return client.terminate();
    client.isAlive = false;
    client.ping(noop);
  });
}, 30000);
