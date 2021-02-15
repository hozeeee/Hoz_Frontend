const https = require('https')
const fs = require('fs')
const os = require('os')
const path = require('path')
const webpush = require('web-push')
const pushKeys = require('./push-keys.js')

// 配置 VAPID
webpush.setVapidDetails(
    pushKeys.subject,
    pushKeys.publicKey,
    pushKeys.privateKey
)

// 配置SSL证书
const opt = {
    key: fs.readFileSync('./内网HTTPS/10.108.143.66-key.pem'),
    cert: fs.readFileSync('./内网HTTPS/10.108.143.66.pem')
}

const myPort = 3011
const requestListener = (req, res) => {
    let reqUrl = req.url || ''
    console.log(reqUrl)

    // 测试 sync 请求
    if (reqUrl === '/testsync') {
        res.writeHead(200)
        res.end()
        return
    }

    // 浏览器发过来的"订阅详情"，再转发给"消息服务器"，让"消息服务器"给用户发消息
    if (reqUrl === '/addsubscription') {
        let buffers = []
        req.on('data', _ => {
            buffers.push(_)
        })
        req.on('end', _ => {
            let bodyStr = Buffer.concat(buffers).toString(),
                subscription = JSON.parse(bodyStr)
            // 发送
            webpush.sendNotification(subscription, '发送给页面的消息').then(_ => {
                // 注意,此时并不代表消息已经成功发送给用户。有可能用户离线或撤销了应用的通知权限。
                console.log('推送消息发送成功')
            }).catch(_ => {
                console.log('推送消息发送失败', _)
            })
        })
        res.writeHead(200)
        res.end()
        return
    }


    // 下面代码可以忽略，只是简单路由....
    let contentType
    if (/\/.+\.css$/g.test(reqUrl)) {
        contentType = 'text/css'
    } else if (/\/.+\.js$/g.test(reqUrl)) {
        contentType = 'application/x-javascript'
    } else if (/\/.+\.json$/g.test(reqUrl)) {
        contentType = 'application/json'
    } else if (/\/.+\.html$/g.test(reqUrl)) {
        contentType = 'text/html'
    } else if (/\/.+\.ico$/g.test(reqUrl)) {
        contentType = 'image/ico'
    } else if (/\/.+\.png$/g.test(reqUrl)) {
        contentType = 'image/png'
    } else if (/\/.+\.mp3$/g.test(reqUrl)) {
        contentType = 'audio/mpeg'
    } else {
        reqUrl = '/index.html'
        contentType = 'text/html'
    }
    res.writeHead(200, {
        "Content-Type": contentType
    })
    let p
    if (reqUrl !== '/sw.js') {
        p = path.join(__dirname, '/web', reqUrl)
    } else {
        p = path.join(__dirname, reqUrl)
    }
    let data = fs.readFileSync(p)

    res.end(data)
}

let app = https.createServer(opt, requestListener)

app.listen(myPort, () => {
    let tmp = os.networkInterfaces()
    for (let key in tmp) {
        let host = (tmp[key].find(i => i.netmask === '255.255.255.0') || {}).address
        host ? console.log(`${key}: https://${host}:${myPort}`) : null
    }
    console.log(`本地: https://localhost:${myPort}`)
});