// 简单服务器
const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  let data, contentType
  if (req.url === '/worker.js') {
    data = fs.readFileSync('./worker.js')
    contentType = 'application/javascript'
  } else {
    data = fs.readFileSync('./index.html')
    contentType = 'text/html'
  }
  res.writeHead(200, {
    'Content-Type': contentType
  })
  res.end(data)
}).listen(3000)