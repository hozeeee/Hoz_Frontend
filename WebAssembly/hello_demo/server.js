const http = require('http')
const fs = require('fs')



http.createServer((req, res) => {
  const myWasm = fs.readFileSync('./hello.wasm'),
    myHtml = fs.readFileSync('./index.html')
  console.log(req.url)
  let file, contentType;
  if (req.url === '/hello.wasm') {
    file = myWasm
    contentType = 'application/wasm'
  } else {
    file = myHtml
    contentType = 'text/html'
  }
  res.writeHead(200, {
    "Content-Type": contentType
  })
  res.end(file)
}).listen(3000, _ => {
  console.log('http://localhost:3000')
})