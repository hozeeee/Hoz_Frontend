const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const fs = require('fs')
const path = require('path')

const app = express()

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// 解析 application/json
app.use(bodyParser.json())

// 添加 session 中间件，之后可以通过 req.session 访问到该对象
app.use(session({
  // 用文件的形式保存会话
  store: new FileStore({
    path: path.join(__dirname, "sessions")
  }),
  // 加密字符串，相当于公钥
  secret: 'keyboard_cat',
  // 设置 cookie 的过期时间
  cookie: {
    maxAge: 30 * 60 * 1000
  },
  resave: true,
  // 是否每次请求都覆盖当前 session-cookie
  saveUninitialized: false
}))

// 创建路由对象 (作为api)
const router = express.Router()
// 登陆
router.post("/login", (req, res) => {
  // 实际生产中，这里应该是到数据库查询用户
  let {
    username,
    password
  } = req.body
  if (username === 'foo' && password === '123') {
    req.session.username = username
    res.redirect("/")
  } else {
    res.status(404).end("登陆失败")
  }
})
// 登出
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})
app.use("/api", router)

// 登陆页
app.get("/login", (req, res) => {
  // 若已登录，跳到主页
  if (req.session.username) {
    return res.redirect("/")
  }
  let html = fs.readFileSync(
    path.join(__dirname, 'login.html'),
    'utf-8'
  ).toString()
  res.end(html)
})

// 主页
app.get("/", (req, res) => {
  // 判断登陆状态
  if (req.session.username) {
    res.send(`
      <p>[${req.session.username}] 你好，你已登陆</p>
      <p><a href="/api/logout">退出登陆</a></p>
    `);
  } else {
    res.send(`
      <div>未登陆</div>
      <p><a href="/login">跳转到登录页</a></p>
    `)
  }
})


app.listen(3000, _ => {
  console.log("http://localhost:3000")
})