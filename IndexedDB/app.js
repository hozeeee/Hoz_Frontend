const http = require('http')
const fs = require('fs')
const os = require('os')

http.createServer((req, res) => {
    console.log(req.url)
    let fileName, contentType
    if (/\/.+\.css$/g.test(req.url)) {
        fileName = req.url.replace('/', '')
        contentType = 'text/css'
    } else if (/\/.+\.js$/g.test(req.url)) {
        fileName = req.url.replace('/', '')
        contentType = 'application/x-javascript'
    } else {
        fileName = 'index.html'
        contentType = 'text/html'
    }
    res.writeHead(200, {
        "Content-Type": contentType
    })
    let data = fs.readFileSync(`./${fileName}`)
    res.end(data)
}).listen(3111, _ => {
    let tmp = os.networkInterfaces()
    for (let key in tmp) {
        let host = (tmp[key].find(i => i.netmask === '255.255.255.0') || {}).address
        host ? console.log(`${key}: http://${host}:3111`) : null
    }
})