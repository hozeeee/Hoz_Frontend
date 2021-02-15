const http = require('http')
const fs = require('fs')

// 此服务器根据不同路由返回特定数据
const app = http.createServer((req, res) => {
  let url = req.url,
    contentType = 'text/plain',
    responseData,
    accessControlAllowOrigin = 'http://localhost:3000',
    accessControlAllowHeaders = '',
    accessControlAllowCredentials = ''

  // 普通文本 ("简单请求")
  if (url === '/text') {
    accessControlAllowCredentials = 'true'
    // 测试 跨域cookie
    let cookie = req.headers.cookie
    // 响应文本
    responseData = ` 一段普通文本。这是 cookie 内容：${cookie}`
  }

  // 获取图片 (非"简单请求",需要先发送"预检请求")
  else if (url === '/png') {
    accessControlAllowCredentials = 'true'
    accessControlAllowHeaders = 'myHeader,Content-Type'
    contentType = 'image/png'
    responseData = fs.readFileSync('./test.png')
  }

  // JSONP
  else if (/\/jsonp/g.test(url)) {
    accessControlAllowOrigin = ''
    // 简单处理参数
    let temp = /\/jsonp\?(.+)/g.exec(url)[1],
      params
    if (temp) {
      params = temp.split('&').map(i => i.split('='))
    }
    contentType = 'application/json'
    let obj = {
      str: 'string',
      num: 123,
      arr: [1, 2, 3]
    }
    for (let item of params.filter(i => i[0] !== 'callback')) {
      obj[item[0]] = item[1]
    }
    // 返回用指定的函数包裹的字符串
    responseData = params.find(i => i[0] === 'callback')[1] +
      '(' +
      JSON.stringify(obj) +
      ')'
  }

  // fetch
  else if (url === '/fetch') {
    accessControlAllowCredentials = 'true'
    responseData = 'fetch 发起请求的响应文本。'
  }

  res.writeHead(200, {
    // 跨域必须设置的一个头(JSONP除外)，设置为"*"可以允许所有域名访问，但安全性不佳
    "Access-Control-Allow-Origin": accessControlAllowOrigin,
    // 当浏览器发起的请求头有"额外"的值时，需要配置
    "Access-Control-Allow-Headers": accessControlAllowHeaders,
    // 当需要请求需要携带cookie时，需要配置
    "Access-Control-Allow-Credentials": accessControlAllowCredentials,
    // 响应的数据类型
    "Content-Type": contentType
  });
  res.end(responseData)
});

app.listen(4000, _ => {
  console.log('http://localhost:4000  (用于测试跨域请求的服务器)')
});