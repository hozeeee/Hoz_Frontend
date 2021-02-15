const net = require('net');
// 创建服务端
const server = net.createServer(scoket => {
  scoket.on('data', buffer => {
    console.log()
    // 随机3秒内返回数据  (从客户端打印的数据看是否能对应的上)
    setTimeout(_ => {
      // 读取前两位 buffer
      let sym = buffer.slice(0, 2);
      // 返回数据
      let buf1 = Buffer.from('服务器已收到('),
        buf2 = buffer.slice(2),
        buf3 = Buffer.from(')');
      scoket.write(Buffer.concat([sym, buf1, buf2, buf3]));
    }, Math.round(Math.random() * 3000));
  })
});
server.listen(4000);