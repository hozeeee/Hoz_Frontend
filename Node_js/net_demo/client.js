const net = require('net');
// 创建客户端"管道"
const socket = new net.Socket({});
// 把"管道"连接上服务器
socket.connect({
  host: 'localhost',
  port: 4000
});
// 监听管道数据
socket.on('data', buffer => {
  let sym = buffer.slice(0, 2).readUInt16BE(),
    data = buffer.slice(2).toString();
  console.log(`打印：【${data}】；sym：【${sym}】。`);
});
// 客户端发送数据到服务端  (简易的聊天室)
process.stdin.on('data', input => {
  // 剪裁掉最后面的两个字符(\r\n)
  input = input.slice(0, input.length - 2);
  // 利用前两位作为数据包的标识  (全双工的必要条件,否则无法知道返回的数据对应哪次请求,但实现未必是这种方式)
  let sym = Buffer.alloc(2);
  sym.writeUInt16BE(Math.round(Math.random() * (2 ** 16 - 1)));
  console.log('sym:', sym.readUInt16BE());
  // 拼接 buffer
  let buf = Buffer.concat([sym, input]);
  // 发送数据
  socket.write(buf);
});