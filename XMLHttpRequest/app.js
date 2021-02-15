const http = require('http');
const fs = require('fs');
const path = require('path');
const mimeTypes = require('mime-types'); // 借助库,获取MIME类型


http.createServer({}, (req, res) => {
  // 简单路由
  let url = req.url,
    buffer
  // 访问 "/static/*" 返回指定文件
  if (url.includes('/static')) {
    let _path = path.join(__dirname, url)
    buffer = fs.readFileSync(_path)
    res.writeHead(200, {
      "Content-Type": mimeTypes.lookup(_path)
    })
    res.end(buffer)
  }
  // 访问 "/getjson" 返回json数据
  else if (url.includes('getjson')) {
    let data = {
      arr: [1, 2, 3],
      obj: {
        x: 1,
        y: 2
      },
      date: new Date(),
      num: 12345,
      str: 'string',
      _null: null
    }
    buffer = Buffer.from(JSON.stringify(data))
    res.writeHead(200, {
      "Content-Type": 'application/json'
    })
    res.end(buffer)
  }
  // 对 "/postform" 使用POST方法提交数据，返回源数据的json字符串
  else if (url.includes('postform')) {
    let reqBuffers = []
    req.on('data', chunk => {
      reqBuffers.push(chunk)
    })
    req.on('end', () => {
      let str = Buffer.concat(reqBuffers).toString()
      res.writeHead(200, {
        "Content-Type": 'text/plain'
      })
      res.end(str)
    })

  }
  // 其他则返回主页
  else {
    buffer = fs.readFileSync('./index.html')
    res.writeHead(200, {
      "Content-Type": 'text/html'
    })
    res.end(buffer)
  }
}).listen(3000, _ => {
  console.log('http://localhost:3000')
})