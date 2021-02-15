
# 简介

[express](http://www.expressjs.com.cn/) 是基于 Node.js 平台，快速、开放、极简的 Web 开发框架。

安装： `npm install express -S` 。

除了以"普通方式"创建 express 项目，还能通过 `express-generator` 快速生成项目：

- `npm i express-generator` 安装生成器，也可以选择全局安装。
- 在项目目录下运行 `express [options] [dir]` 生成项目。如需在当前目录下创建，运行 `express .` 。
- 注意，生成后的项目是没有 `node_modules` 文件夹，需要 `npm install` 安装需要的依赖包。
- 创建后的项目，入口文件是 `bin` 目录下的 `www` 文件。

</br>
</br>

# router(路由)

创建路由的语法如下：

``` js
// 创建路由对象
const usersRouter = express.Router();
usersRouter.get('/', (req, res, next) => {
  res.send('user home');
});
usersRouter.get('/foo', (req, res, next) => {
  res.send('foo page');
});
// 添加路由
app.use('/users', usersRouter);
// 创建路由对象还有如下写法： (便于创建同一路径下的不同方法。)
usersRouter.route('/bar')
  .get((req, res, next) => {
    console.log('....');
    next();
  })
  .get((req, res, next) => {
    res.send('bar get');
  })
  .post((req, res, next) => {
    res.send('bar post');
  });
```

除了上面的 `app.<METHOD>` ，还可以通过 `app.all()` 为所有的 HTTP 请求方法的路径添加中间件。

其中 `<METHOD>` 的值有：

|            |          |             |
|:----------:|:--------:|:-----------:|
|  checkout  |  mkcol   |   **put**   |
|    copy    |   move   |   report    |
|   delete   | m-search |   search    |
|  **get**   |  notify  |  subscribe  |
|    head    | options  |    trace    |
|    lock    |  patch   |   unlock    |
|   merge    | **post** | unsubscribe |
| mkactivity |  purge   |             |
|            |          |             |

对于上面代码，假设挂载到本地的 `3000` 端口。当访问 `http://localhost:3000/users/` 返回 `user home` ；访问 `http://localhost:3000/users/foo` 返回 `foo page` 。 `foo` 是 `users` 的子路由。

**路由**对象还可以**嵌套**使用，即创建子路由。代码如下：

``` js
// 创建子路由
const subRouter = express.Router();
subRouter.get('/baz', (req, res, next) => {
  res.send('baz page');
});
// 添加子路由
usersRouter.use(subRouter);
```

同样是使用 `app.use()` 语法添加路由。访问 `http://localhost:3000/users/foo` 得到 `baz page` 。

## 路由路径参数

语法如下：

``` js
app.get("/test/:group/:name", (req, res) => {
  // 获取路由路径参数
  let group = req.param.group
  let name = req.param.name;
})
```

## 路由路径模糊匹配

路由路径可以是字符串，**字符串**或**正则表达式**。

如 `app.get("/abc?d", ()=>{})` 可以匹配到 `/abd` 或 `/abcd` ，规则类似于正则，具体请看官网。

当然，可以直接使用正则匹配。如 `app.get(/a/, ()=>{})` 可以匹配到路径带有 "`a`" 的任何内容。

## 获取请求携带的信息

对于如 `http://localhost:3000/home?foo=1&baz=2` ，`?` 后携带的参数可以通过 `req.query` 获取，即 `req.query.foo` 的值为 `1` 。

## 同时添加多个中间件

为同一个路径的路由，可以同时添加多个中间件，中间件会依次执行。

``` js
app.get(
  '/example/d',
  // 可以用数组的形式添加
  [
    (req, res, next) => { next(); },
    (req, res, next) => { next(); }
  ],
  // 也可以用逗号分隔，逐个添加
  (req, res, next) => { next(); },
  (req, res) => { res.send('Hello!'); }
)
```

## 响应对象的方法

除了上面介绍的 `res.send()` 外，还有如下方法可以使用。

|       方法       |               描述                |
|:----------------:|:---------------------------------:|
|  res.download()  |        提示要下载的文件。         |
|    res.end()     |          结束响应过程。           |
|    res.json()    |         发送 JSON 响应。          |
|   res.jsonp()    | 发送带有 JSONP 支持的 JSON 响应。 |
|  res.redirect()  |           重定向请求。            |
|   res.render()   |          渲染视图模板。           |
|    res.send()    |       发送各种类型的响应。        |
|  res.sendFile()  |    将文件作为八位字节流发送。     |
| res.sendStatus() |        设置响应状态代码。         |

## 静态资源访问

为了提供诸如图像、CSS 文件和 JavaScript 文件之类的静态文件，请使用 Express 中的 `express.static` 内置中间件函数。

``` js
// 将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问 (挂载到根路径上,如"http://localhost:3000/hello.html")
app.use(express.static('public'));
// 当然可以添加多个目录 (挂载到"static"路径上,如"http://localhost:3000/static/hello.html")
app.use('/static', express.static('files'));
```

更多 `server-static` 的知识请查看 [`server-static`](http://www.expressjs.com.cn/resources/middleware/serve-static.html) 。

## 响应404错误

``` js
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
```

</br>
</br>

# middleware(中间件)

中间件本质就是一个**回调函数**，该函数都有三个参数，依次为：`request`、`response`、`next`。中间件就是对 `request` 和 `response` 两个对象的"加工处理"，而 `next` 是一个回调函数，调用该方法后把"处理权"交给下一个中间件。最后返回特定的数据，这就是所谓的"**洋葱模型**"。

上面介绍的路由，也是中间件的一种。

``` js
const express = require('express')
const app = express()
const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
// 忽略"路由路径"时，会在路由到达"/"之前，加载此中间键。
app.use(myLogger)
// 为特定的"路由路径"添加中间件
app.get('/', function (req, res) {
  res.send('Hello World!')
})
app.listen(3000)
```

具体的中间件使用介绍，可以查看 [官方文档](http://www.expressjs.com.cn/4x/api.html#app.use) 。

</br>
</br>

# 错误处理器

中间件的回调函数 `next()` 可以把错误对象作为参数传入。如：

``` js
app.get("/", (req, res, next) => {
  fs.readFile("/file-does-not-exist", (err, data) => {
    // 若发生错误，把错误对象传递给"next"回调函数
    if (err) { next(err); }
    else { res.send(data); }
  });
});
```

Express 带有内置的错误处理程序，可处理应用程序中可能遇到的任何错误。该默认的错误处理中间件功能添加在中间件功能堆栈的末尾。

如果将错误传递给 `next()` 您并且未在自定义错误处理程序中进行处理，则它将由内置错误处理程序进行处理；错误将与堆栈跟踪一起写入客户端。堆栈跟踪不包括在生产环境中。

如果 `next()` 在开始编写响应后调用错误（例如，如果在将响应流传输到客户端时遇到错误），则 Express 默认错误处理程序将关闭连接并使请求失败。

因此，当您已将 headers 发送到客户端时，必须添加自定义错误处理程序，委派给默认的 Express 错误处理程序：

``` js
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}
```

编写错误处理程序：

``` js
// 4 个参数，第一个为错误对象
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});
```

[](http://www.expressjs.com.cn/guide/error-handling.html)

</br>
</br>

# 调试

Express 在内部使用 [`debug`](https://www.npmjs.com/package/debug) 模块来记录有关路由匹配、正在使用的中间件功能、应用程序模式以及请求-响应周期流的信息。

> `debug` 就像是的增强版 `console.log` ，但与不同 `console.log` ，您不必 `debug` 在生产代码中注释掉日志。默认情况下，日志记录是关闭的，可以使用 `DEBUG` 环境变量有条件地将其打开。

``` shell
> DEBUG=express:* node index.js
```

在 window 上的命令：

``` shell
> set DEBUG=express:* & node index.js
```

要仅查看来自路由器实现的日志，请将的值设置 `DEBUG` 为 `express:router` 。同样，要仅查看来自应用程序实现的日志，请将的值设置 `DEBUG` 为 `express:application` ，依此类推。

更多内容，请查询 [`debug`](https://www.npmjs.com/package/debug) 模块的使用。

</br>
</br>

# API简介

## `express`的方法

### express.json([options])

这是 Express 中的内置中间件功能。它使用 [`body-parser`](http://www.expressjs.com.cn/en/resources/middleware/body-parser.html) **解析带有 JSON 的请求**。

`[options]` 是一个对象，具体属性请查阅 [官方文档](http://www.expressjs.com.cn/4x/api.html#express.json) 。

### express.static(root, [options])

这是 Express 中的内置中间件功能。它**提供静态文件**，并基于 [`serve-static`](http://www.expressjs.com.cn/en/resources/middleware/serve-static.html) 。

`root` 参数指定要从其提供静态资源的根目录。

`[options]` 是一个对象，具体属性请查阅 [官方文档](http://www.expressjs.com.cn/4x/api.html#express.static) 。

### express.Router([options])

创建一个**新的路由器对象**，如 `var router = express.Router([options]);` 。

`[options]` 的可选值如下：

|     属性      |                       描述                       | 默认  | 可用性 |
|:-------------:|:------------------------------------------------:|:-----:|:------:|
| caseSensitive | 是否启用区分大小写。(false时,"/Foo"等同于"foo")  | false |        |
|  mergeParams  | 是否合并路由。(当路由冲突,若不合并,以子路由为准) | false | 4.5.0+ |
|    strict     |   启用严格路由。(false时,"/foo"等同于"/foo/")    | false |        |

### express.urlencoded([options])

这是 Express(v4.16.0+) 中的内置中间件功能。它使用 urlencode 有效载荷解析的请求，并且基于 [`body-parser`](http://www.expressjs.com.cn/en/resources/middleware/body-parser.html) 。

`[options]` 是一个对象，具体属性请查阅 [官方文档](http://www.expressjs.com.cn/4x/api.html#express.urlencoded) 。

</br>

## app.*

通过 `const app = express();` 创建服务器对象。服务器对象上有多个方法，下面简单介绍。

### app.set()

app.disable()、app.disabled()、、app.enable()、app.enabled()
app.get（名称）

### app.engine(ext [,callback])

指定特定的模板引擎。如 `app.engine('pug', require('pug').__express);` 。

### app.listen([port[, host[, backlog]]][, callback])

将 `app` 挂载到指定的端口上。

### app.param（[名称]，回调）

针对**路由路径参数**的中间件，凡是路由路径参数中带有指定的参数名，就会触发该中间件。例子如下：

``` js
// 针对参数`id`，添加中间件
app.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE');
  next();
});
// 也可以为`id`和`page`添加中间件 (需要注意,如果路径参数中包含n个,此中间件会触发n次)
app.param(['id', 'page'], function (req, res, next, value) {
  console.log('CALLED ONLY ONCE with', value);
  next();
});
// 路由路径参数
app.get('/user/:id', function (req, res) {
  console.log('and this matches too');
  res.end();
});
app.get('/user/:id/:page', function (req, res) {
  console.log('and this matches too');
  res.end();
});
```

### app.path()

获取当前应用的路径(字符串)。

``` js
const app = express(),
      blog = express(),
      blogAdmin = express();
app.use('/blog', blog);
blog.use('/admin', blogAdmin);
// 获取路径
console.log(app.path()); // ''
console.log(blog.path()); // '/blog'
console.log(blogAdmin.path()); // '/blog/admin'
```

### app.render(view, [locals], callback)

通过 `callback` 函数返回视图的渲染 HTML 。它接受一个可选参数，该参数是一个包含视图局部变量的对象。就像 `res.render()` 一样，除了它不能自行将渲染的视图发送给客户端。

``` js
app.render('email', { name: 'Tobi' }, function(err, html){
  // ...
});
```

### app.route(path)

返回单个路由的实例，然后您可以使用该路由通过可选的中间件来处理HTTP动词。使用 app.route() 以避免重复路线名称（因此错字错误）。

``` js
var app = express();

app.route('/events')
  .all(function(req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
  })
  .get(function(req, res, next) {
    res.json(...);
  })
  .post(function(req, res, next) {
    // maybe add a new event...
  });
```

### app.set(name, value)

将设置分配 `name` 给 `value` 。您可以存储所需的任何值，也可以使用某些名称来**配置服务器的行为**。特殊名称列表如下：

|          属性          |      类型       |                                      描述                                      |               默认               |
|:----------------------:|:---------------:|:------------------------------------------------------------------------------:|:--------------------------------:|
| case sensitive routing |     Boolean     |                           启用区分大小写。(会被继承)                           |           `undefined`            |
|          env           |     String      |                                   环境模式。                                   |      `process.env.NODE_ENV`      |
|          etag          |     Varied      |  设置 ETag 响应头，通过 [`etag`](https://www.npmjs.com/package/etag) 包实现。  |             `"weak"`             |
|                        |                 |          设为`true`表示启用弱 ETag ，设为`false`表示完全禁用 ETag 。           |                                  |
|                        |                 |         设为 "strong" 表示启用强 ETag，设为 "weak" 表示启用弱 ETag 。          |                                  |
|                        |                 |      设为函数时，其参数分别是 `body` 和 `encoding` ，需返回上面值的一种。      |                                  |
|  jsonp callback name   |     String      |                          指定默认的 JSONP 回调名称。                           |           `"callback"`           |
|      json escape       |     Boolean     |               JSON 启用转码，即把`<`,`>`,`&`符号转义。(会被继承)               |           `undefined`            |
|     json replacer      |     Varied      |                  `JSON.stringify`的`replacer`参数。(会被继承)                  |           `undefined`            |
|      json spaces       |     Varied      |                   `JSON.stringify`的`space`参数。(会被继承)                    |           `undefined`            |
|      query parser      |     Varied      |               设置`query`参数的解析方式(即url中`?`后面的部分)。                |           `"extended"`           |
|                        |                 |             可选值有："simple"或"extended"；`false`；`Function`。              |                                  |
|                        |                 |                "simple"是基于Nodejs原生的 `querystring` 模块；                 |                                  |
|                        |                 |                     "extended"是基于第三方js库 `qs` 模块。                     |                                  |
|                        |                 |                        设为`fasle`表示禁用`query`参数。                        |                                  |
|                        |                 |               设为函数时，参数为完整的查询字符串，必须返回对象。               |                                  |
|     strict routing     |     Boolean     |           启用严格路由，非严格模式下"/foo/"等同于"/foo"。(会被继承)            |           `undefined`            |
|    subdomain offset    |     Number      |                   要删除以访问子域的主机的点分隔部分的数量。                   |               `2`                |
|      trust proxy       |     Varied      |        设置可信任代理。通过`proxy-addr`包实现。(会被继承,即使有默认值)         |             `false`              |
|                        |                 | 当设为`true`，客户端会选用`X-Forwarded-*`中最左边的一条；设为`false`表示禁用。 |                                  |
|                        |                 |              若指定字符串或字符串数组，设置一个或多个受信任代理。              |                                  |
|                        |                 |             若指定函数，参数为`ip`值，必须返回布尔值表示是否新人。             |                                  |
|                        |                 |           若指定正整数，表示信任来自前端代理服务器的第 n 个中继段。            |                                  |
|         views          | String/String[] |                  应用程序视图的目录，若是数组则依次指定多个。                  |    `process.cwd() + '/views'`    |
|       view cache       |     Boolean     |                   启用视图模板编译缓存。(非生产环境不会继承)                   | `true`(生产);`undefined`(非生产) |
|      view engine       |     String      |                           默认引擎扩展名。(会被继承)                           |           `undefined`            |
|      x-powered-by      |     Boolean     |                    启用 `"X-Powered-By: Express"` HTTP 头。                    |              `true`              |

注意，除了特别说明的属性，其他都不具有继承性。

</br>
</br>

# `request`(请求对象)

是中间件的第一个参数(错误处理的中间件除外)，包含 HTTP 请求的内容。 `request` 对象是 Nodejs 所有原生属性和方法的增强，所以包含他的所有 [属性和方法](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 。

## `request`的属性

- `req.app`: 此属性保存对使用中间件的 Express 应用程序实例的引用。
- `req.baseUrl`: 路由器实例安装所在的 URL 路径。
- `req.body`: 请求体，包含在请求正文中提交的数据的键值对。默认情况下，它是 `undefined` ，并且在使用诸如 `body-parser` 和 `multer` 之类的主体解析中间件时填充。
- `req.cookies`: 使用 `cookie-parser` 中间件时，此属性是一个包含请求发送的 `cookie` 的对象。如果请求中不包含 `cookie` ，则默认为 `{}` 。
- `req.fresh`: 指示请求是否为"新鲜"，与 `req.stale` 相对。所谓的"新鲜"，即客户端使用缓存且未过期。当客户端的缓存中的响应仍为"新鲜"时，值为 `true` ，否则为 `false` 。
- `req.stale`: 指示请求是否"过时"，与 `req.fresh` 相对。
- `req.hostname`: 获取 HTTP 请求头中的 `Host` 字段值。若 `trust proxy` 设置的值不为 `false` ，则是 `X-Forwarded-Host` 的值。
- `req.ip`: 获取请求端的 ip 地址。若 `trust proxy` 设置的值不为 `false` ，则是 `X-Forwarded-For` 的值。
- `req.ips`: 以数组形式，包含多个 `req.ip` 。
- `req.method`: 请求的方法，如 `GET`，`POST`，`PUT` 等。
- `req.originalUrl`: 此属性跟 `req.url` 很像，但它保留了原始请求 URL ，即包括 `?` 号及后面的参数。
- `req.params`: 此属性是一个对象，默认为 `{}` ，其中包含路由路径参数的值。
  - 举例，从路径 `/user/:name` 以 `req.params.name` 读取到 `"name"` 属性。
  - 若路径参数使用了正则，可以使用 `req.params[n]` 获取第 n 个捕获组。
- `req.query`: 此属性是一个对象，默认为 `{}` ，其中包含路由中每个查询字符串参数的属性。就是 url 中 `?` 后面携带的参数。
- `req.protocol`: 包含请求的协议字符串，如 `"http"` 、 `"https"` 等。若 `trust proxy` 设置的值不为 `false` ，则是 `X-Forwarded-Proto` 的值。
- `req.route`: 包含当前匹配的路由。
- `req.secure`: 布尔值，如果建立 TLS 连接，则为 `true` 。等效于 `'https' == req.protocol;` 。
- `req.signedCookies`: 使用 `cookie-parser` 中间件时，此属性包含请求发送的**已签名的** `cookie` 。
  - 请注意，对 cookie 签名不会使其"隐藏"或加密，但只是防止篡改(因为用于签名的秘密是私有的)。
  - 举例，对于 `Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3` ， `req.signedCookies.user` 的值为 `"tobi"` 。
- `req.subdomains`: 请求的域名中的子域数组。
  - 举例，对于 `"tobi.ferrets.example.com"` 此属性的值为 `["ferrets", "tobi"]` 。
  - application 属性 `subdomain offset`(默认为2) 用于确定子域段的开头。要更改此行为，请使用 `app.set` 更改其值。
- `req.xhr`: 布尔值，当请求头中的 `X-Requested-With` 值为 `XMLHttpRequest` 时，此属性值为 `true` 。

## `request`的方法

- `req.accepts()`: 根据请求的 HTTP 头的 `Accept` 字段检查指定的内容类型是否可接受，返回最佳匹配，无则返回 `undefined` 。

  - ``` js
    // Accept: text/html
    req.accepts('html');
    // => "html"

    // Accept: text/*, application/json
    req.accepts('png');
    // => undefined
    ```

  - 有关更多信息，请参阅 [accepts 包](https://github.com/jshttp/accepts) 。

  - 类似的还有：
    - `req.acceptsCharsets()`: 针对 `Accept-Charset` 字段。
    - `req.acceptsEncodings()`: 针对 `Accept-Encoding` 字段。
    - `req.acceptsLanguages()`: 针对 `Accept-Language` 字段。

- `req.get()`: 获取指定的 HTTP 请求标头字段(不区分大小写)的值，无则返回 `undefined` 。

  - ``` js
    req.get('Content-Type');
    // => "text/plain"
    ```

- `req.is()`: 判断 HTTP 头的 `Content-Type` 是否为理想类型。

  - ``` js
    // Content-Type: text/html; charset=utf-8
    req.is('html');       // => 'html'
    req.is('text/html');  // => 'text/html'
    req.is('text/*');     // => 'text/*'
    req.is('png');        // => false
    ```

  - 有关更多信息，请参阅 [type-is 包](https://github.com/jshttp/type-is) 。

- `req.range(size [,options])`: 解析 HTTP 头中的 `Range` 字段(与断点续传有关)。

  - 当函数返回 `-2` 时，表示 HTTP 头字段值格式错误；返回 `-1` 时，表示范围无法满足；正确解析是，会返回一个数组。

  - 参数中 `size` 是资源的最大大小。 `options` 是一个对象，只有一个属性 `combin` ，布尔值，指定是否应合并重叠范围和相邻范围，默认为 `false` 。

  - ``` js
    // parse header from request
    var range = req.range(1000)

    // the type of the range
    if (range.type === 'bytes') {
      // the ranges
      range.forEach(function (r) {
        // do something with r.start and r.end
      })
    }
    ```

</br>
</br>

# `response`(响应对象)

该对象表示 Express 应用收到 HTTP 请求时发送的 HTTP 响应。

## `response`的属性

- `res.app`: 此属性保存对使用中间件的 Express 应用程序实例的引用。
- `res.headersSent`: 布尔值，指示应用程的响应是否已发送。
- `res.locals`: 对象，其中包含作用域为请求的响应局部变量，因此仅对在请求/响应周期中呈现的视图可用(如果有)。此属性用于公开请求级别的信息，如请求路径名、经过身份验证的用户、用户设置等。

## `response`的方法

### `res.append(field [,value])`

将特定的键值对添加/覆盖字段到 HTTP 响应头。注意，在 `res.set()` 之后调用 `res.append()` 会将前者的值覆盖。

### `res.attachment([filename])`

若 `filename` 为空，则会将响应头的 `Content-Disposition` 字段设为 `"attachment"` ；否则会根据文件，设置响应头的 `Content-Disposition` 和 `Content-Type` 。

例子如下：

``` js
res.attachment();
// Content-Disposition: attachment

res.attachment('path/to/logo.png');
// Content-Disposition: attachment; filename="logo.png"
// Content-Type: image/png
```

### `res.cookie(name,value[,options])`

设置响应的 `cookie` 。

`value` 可以是字符串或 JSON 对象。

`options` 是一个对象，可选属性如下：

|   属性   |      类型      |                             描述                              |
|:--------:|:--------------:|:-------------------------------------------------------------:|
|  domain  |     String     |             Cookie 的域名。默认为应用程序的域名。             |
|  encode  |    Function    | 用于 cookie 值编码的同步函数。默认为 `encodeURIComponent` 。  |
| expires  |      Date      | **到期日期**(GMT)。若未指定或设为 0 ，则创建 session cookie。 |
| httpOnly |    Boolean     |            将 Cookie 标记为只能由 Web 服务器访问。            |
|  maxAge  |     Number     |      方便的设置相对于当前时间的**到期时间**(单位：ms)。       |
|   path   |     String     |                Cookie 的路径。默认为 `"/"` 。                 |
|  secure  |    Boolean     |             将 cookie 标记为仅与 HTTPS 一起使用。             |
|  signed  |    Boolean     |             指示是否应该对 cookie 进行**签名**。              |
| sameSite | Boolean/String |          设置 `Set-Cookie`属性的中 `SameSite` 的值。          |

这里简单说一下 `sameSite` ，其作用是防止 CSRF 攻击和用户追踪。可选值有三个：`Strict`、`Lax`、`None`。例子： `Set-Cookie: SameSite=Strict;` 。三者的区别可以去看[阮一峰的博客](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)。

### `res.clearCookie(name [, options])`

清除指定 `name` 的 cookie 。

`options` 与 [`res.cookie()`](#`res.cookie(name,value[,options])`) 的相同。

需要注意，除了 `expires` 和 `maxAge` ，只有给定的 `options` 与 `res.cookie()` 相同，客户端才会清除该 cookie 。

### `res.download((path [, filename] [, options] [, fn])`

指定客户端下载的文件。

`filename` 参数用于指定客户端下载时的默认文件名。

`options` 和 `fn` 与 [`res.sendFile()`](#`res.sendFile(path[,options][,fn])`) 的参数相同。

``` js
res.download('/report-12345.pdf');
```

### `res.end([data] [, encoding])`

结束响应过程。

建议用于响应不携带数据。如果需要用数据响应，请使用如 `res.send()` 和 `res.json()` 等方法。

此方法基于 Nodejs 的 [`response.end()`](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback) 。

``` js
res.end();
res.status(404).end();
```

### `res.format(object)`

针对不同的 MIME 类型使用相应的格式化函数。

``` js
res.format({
  'text/plain': function(){
    res.send('hey');
  },
  'text/html': function(){
    res.send('<p>hey</p>');
  },
  'application/json': function(){
    res.send({ message: 'hey' });
  },
  'default': function() {
    // log the request and respond with 406
    res.status(406).send('Not Acceptable');
  }
});
```

### `res.get(field)`

返回由指定的 HTTP 响应头字段。不区分大小写。

``` js
res.get('Content-Type');
// => "text/plain"
```

### `res.set(field [, value])`

将指定的 HTTP 响应头字段设置为指定的值。

### `res.json([body])`

发送 JSON 响应。

``` js
res.json(null);
res.json({ user: 'tobi' });
res.status(500).json({ error: 'message' });
```

### `res.jsonp([body])`

发送带有 JSONP 支持的 JSON 响应。

``` js
res.jsonp({ user: 'tobi' });
// => callback({ "user": "tobi" })
```

默认的回调函数名字的 `"callback"` ，可以通过 `app.set("jsonp callback name", <targetName>)` 修改回调函数的名字。

### `res.links(links)`

设置 HTTP 响应头字段 `Link` 的内容(与`<link>`标签作用相同)。

例子如下：

``` js
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5'
});
```

产生的结果如下：

``` js
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
```

### `res.location(path)`

设置 HTTP 响应头字段 `Location` 的值。

### `res.redirect([status,] path)`

重定向到指定的 URL 。 `status` 默认是 `302` 。

``` js
res.redirect('/foo/bar');
res.redirect('http://example.com');
res.redirect(301, 'http://example.com');
res.redirect('../login');
res.redirect('back'); // "back"有特殊含义,表示上一个路径
```

### `res.render(view [, locals] [, callback])`

参数说明：

- `view` 是 view 模板文件的路径。
- `locals` 是一个对象，为 view 提供局部变量。
- `callback` 回调函数，其参数有两个：错误对象和 view 字符串。

官方例子如下：

``` js
// send the rendered view to the client
res.render('index');
// if a callback is specified, the rendered HTML string has to be sent explicitly
res.render('index', function(err, html) {
  res.send(html);
});
// pass a local variable to the view
res.render('user', { name: 'Tobi' }, function(err, html) {
  // ...
});
```

### `res.send([body])`

发送 HTTP 响应。 `body` 参数可以是 `Buffer`、`String`、`Object`、`Array` 。

### `res.sendFile(path[,options][,fn])`

把路径 `path` 下的文件传输到客户端，会自动根据文件类型设置 `Content-Type` 。

除非 `options.root` 设置了，否则 `path` 必须是绝对路径。

`options` 的可选属性如下：

|     属性     |                                             描述                                              |    默认    | 可用性 |
|:------------:|:---------------------------------------------------------------------------------------------:|:----------:|:------:|
|    maxAge    |                设置 Cache-Control 的 max-age 属性。(单位毫秒,或字符串`"*ms"`)                 |    `0`     |        |
|     root     |                                     相对文件名的根目录。                                      |            |        |
| lastModified |       将 Last-Modified 标头设置为操作系统上文件的最后修改日期。设为 `false` 表示禁用。        |  Enabled   | 4.9.0+ |
|   headers    |                          包含要与文件一起使用的 HTTP 响应头的对象。                           |            |        |
|   dotfiles   |                用于提供点文件的选项。可选值：`"allow"`、`"deny"`、`"ignore"`。                | `"ignore"` |        |
| acceptRanges |                                   启用或禁用接受远程请求。                                    |   `true`   | 4.14+  |
| cacheControl |                      启用或禁用设置 Cache-Control 响应头。(是否使用缓存)                      |   `true`   | 4.14+  |
|  immutable   | 是否文件没变化(告诉客户端是否需要重新下载;还是直接使用缓存)。设为`true`时还应设置`maxAge`的值 |  `false`   | 4.16+  |

有关更多信息，请参阅 [`send`](https://github.com/pillarjs/send) 。

### `res.status(code)`

设置响应状态码，返回 `res` 对象，所以可以用"链式操作"。

### `res.sendStatus(statusCode)`

设置响应状态码，并将其对应的字符串作为响应主体。

``` js
res.sendStatus(500); // 等同于 res.status(500).send('Internal Server Error')
```

### `res.type(type)`

设置 HTTP 响应头字段 `Content-Type`的值。

### `res.vary(field)`

设置 HTTP 响应头字段 `Vary` 的值。

</br>
</br>

# 常用中间件

下面简单说一些，了解更多可以查阅 [官网](http://www.expressjs.com.cn/resources/middleware.html) 的介绍。

## 身份验证

由于 HTTP 请求是无状态的，所以需要身份验证。所谓的"无状态"就是不知道请求者是谁。实现方式都是前端登录成功后，用特定的数据记录其状态，下次用户再次连接时验证其合法性。

### `express-session`

使用 [`express-session`](https://www.npmjs.com/package/express-session) 中间件后，之后的中间件都能通过 `req.session` 访问到一个 `session` 对象，该对象包含 `cookie` 对象，当 `cookie` 对象超时后， `session` 对象会销毁。

我们可以在登陆后，给 `session` 对象添加一些属性，如 `login = true` ，其他中间件检测 `req.session.login` 属性是否为 `true` 即可。但实际生产中不可能这么简单，还需要对其加密。

通过 `req.session.destroy()` 删除 `cookie` ，可以用于退出登陆。

具体代码请看 [demo 代码](./demo/login_demo/app.js) 。

### JWT (JSON Web Token)

需要 `jsonwebtoken` npm 模块。使用该模块需要提供两个东西：

- 指定特定的加密算法
- 私钥(自定义字符串)
- 数据内容(会被特定算法转换成字符串)

步骤：

1. 登陆成功后，生成 token ，并发送给前端
2. 前端把 token 储存
3. 前端请求页面时带上 token
4. 后端验证 token 合法性

## body-parser

解析请求体的数据，用法也很简单，如下：

``` js
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// 解析 application/json
app.use(bodyParser.json())
```

## compression

**Gzip 压缩**可以大大减小响应主体的大小，从而提高 Web 应用程序的速度。在 Express 应用程序中使用 [`compression`](https://www.npmjs.com/package/compression) 中间件进行 gzip 压缩。

实例代码如下：

``` js
var compression = require('compression')
var express = require('express')
var app = express()
app.use(compression())
```

</br>
</br>

# 其他

## 流程管理器

[http://www.expressjs.com.cn/en/advanced/pm.html](http://www.expressjs.com.cn/en/advanced/pm.html)

### forever

[Forever](https://github.com/foreversd/forever) 是一个简单的命令行界面工具，用于确保给定脚本连续（永久）运行。 Forever 的简单界面使其非常适合运行 Node.js 应用程序和脚本的较小部署。

### pm2

[PM2](https://github.com/Unitech/pm2) 是 Node.js 应用程序的生产过程管理器，它具有内置的负载平衡器。 PM2 允许您永久保留应用程序的生命，并在不停机的情况下重新加载它们，并简化了常见的系统管理任务。 PM2 还使您能够管理应用程序日志记录，监视和群集。

### strongloop

[http://strong-pm.io/](http://strong-pm.io/)

### SystemD

[http://www.expressjs.com.cn/advanced/pm.html#systemd](http://www.expressjs.com.cn/advanced/pm.html#systemd)

## helmet

[helmet](https://www.npmjs.com/package/helmet) 可通过设置各种 HTTP 标头来帮助您保护 Express 应用程序。这不是灵丹妙药，但可以帮上忙！

## winston 和 bunyan

[`winston`](https://www.npmjs.com/package/winston) 和 [`bunyan`](https://www.npmjs.com/package/bunyan) 都是**日志框架**。选择其中一个使用即可。这 [文章](https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/) 是对两者的对比。

## terminus

[`Terminus`](https://github.com/godaddy/terminus) 是一个开源项目，可为您的应用程序添加运行状况检查和正常关闭，从而无需编写样板代码。您只需提供用于正常关闭的清除逻辑和用于运行状况检查的运行状况检查逻辑，然后由终端处理其余内容。

</br>
</br>

# SSR(Server Side Rendering, 服务端渲染)

与传统 SPA (Single-Page Application, 单页应用程序) 相比，服务器端渲染 (SSR) 的优势主要在于：

- 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
- 更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。通常可以产生更好的用户体验，并且对于那些「内容到达时间(time-to-content) 与转化率直接相关」的应用程序而言，服务器端渲染 (SSR) 至关重要。

使用服务器端渲染 (SSR) 时还需要有一些权衡之处：

- 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。
- 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

## 使用Vue作为模板引擎

### ssr.vuejs.org

[**ssr.vuejs.org**](https://ssr.vuejs.org/zh/) 是官方的介绍文档，此 [demo](https://github.com/vuejs/vue-hackernews-2.0) 是文档对应的项目。

其中需要说明的：

- `vue-server-renderer` 其中包含 `*/client-plugin` 和 `*/server-plugin` 分别作为客户端和服务端的配置文件的插件，打包后会生成 `.json` 文件。
  - `vue-server-renderer` 的 `createBundleRenderer` 函数可以使用上面打包的 `.json` 文件。

- 需要配置 `optimization.splitChunks` 以提取公共代码。

- 需要使用 `webpack-dev-middleware` 中间件，用于开发中监听文件的修改。

[`ssr_vue_demo`](#ssr_vue_demo) 中简单演示了其中的内容，但还是建议看 [官方 demo](https://github.com/vuejs/vue-hackernews-2.0) 的(虽然是用webpack3)。

### Nuxt.js

[Nuxt](https://nuxtjs.org) 是一个基于 Vue 生态的更高层的框架，为开发服务端渲染的 Vue 应用提供了极其便利的开发体验。

`npx create-nuxt-app <项目名>` 创建项目，下载完成后会有一系列的提示选项，包括服务器框架，UI框架等。

### Quasar Framework

[Quasar Framework](https://quasar.dev/) 可以通过其一流的构建系统、合理的配置和开发者扩展性生成 (可选地和 PWA 互通的) SSR 应用，让你的想法的设计和构建变得轻而易举。

脚手架安装： `npm install -g @quasar/cli` ；创建项目： `quasar create <folder_name>` 。

Quasar Framework 除了创建创建 SSR 项目，还能创建 APP(包括安卓和ios)、桌面级应用等，是一个比较强大的框架。

</br>
</br>
