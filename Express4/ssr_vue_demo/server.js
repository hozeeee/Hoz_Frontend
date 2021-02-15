const path = require('path')
const fs = require('fs')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')


const app = express()

// 创建 renderer
const html = fs.readFileSync('./index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json') // 这个可以动态将生成的js文件渲染到html模版中
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template: html,
  clientManifest: clientManifest
})

app.use(express.static(path.join(__dirname, 'dist')))
// 响应路由请求
app.get('*', (req, res) => {
  const context = {
    url: req.url
  }
  // 创建vue实例，传入请求路由信息
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return res.state(500).end('运行时错误')
    }
    res.send(html)
  })
})

// 服务器监听地址
app.listen(3001, () => {
  console.log('服务器已启动！http://localhost:3001/')
})