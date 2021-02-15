// 创建 http 服务
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('hello cluster');
}).listen(4000, _ => {
  // 这里你会发现打印了多条
  // 但并不意味着多个进程监听了听一个端口
  // cluster 对 listen 有改写 (详细请看源码)
  console.log('listening 4000');
})