const http = require('http')
const fs = require('fs')

// 此服务器只返回 HTML 页面
const app = http.createServer((req, res) => {
  let buffer = fs.readFileSync('./index.html');
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.end(buffer)
});

app.listen(3000, _ => {
  console.log('http://localhost:3000  ("本地"服务器,返回测试页面)')
});