const fs = require('fs');
const http = require('http');
const path = require('path');

http.createServer((req, res) => {
    console.log(req.url);
    if (req.url.includes('/testaxios')) {
        let reqBodyBufs = []
        req.on('data', e => {
            reqBodyBufs.push(e)
            // console.log(e.toString())
        })
        req.on('end', e => {
            let str = Buffer.concat(reqBodyBufs).toString()
            console.log(str)
            res.writeHead(200);
            res.end();

        })
    } else if (req.url === '/axios.min.js') {
        let file = fs.readFileSync(path.join(__dirname, 'axios.min.js'));
        res.writeHead(200, {
            "Content-Type": "application/x-javascript"
        });
        res.end(file);
    } else {
        let file = fs.readFileSync(path.join(__dirname, 'index.html'));
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(file);
    }
}).listen(3001, _ => {
    console.log('http://localhost:3001');
});