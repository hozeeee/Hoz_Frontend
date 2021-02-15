const http = require('http');

http.createServer((req, res) => {
  console.log(req.url);
  if (req.url === '/redirect') {
    setTimeout(() => {
      res.writeHead(301, {
        'Location': 'http://localhost:4001/redirect'
      });
      res.end();
    }, 1000);
    return;
  }
  if (req.url === '/timeout') {
    setTimeout(() => {
      res.writeHead(200);
      res.end();
    }, 10000);
    return;
  }
  if (req.url === '/notfound') {
    res.writeHead(400);
    res.end();
    return;
  }
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify({
    foo: "baz"
  }));
}).listen(4001, _ => {
  console.log('server: http://localhost:4001')
});