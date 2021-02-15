
# egg

创建模板项目：

- `npm init egg --type=simple`: 默认最简单的项目
- `npm init egg --type=ts`: 可以创建基于 typescript 的项目


以 ts 项目结构为例：

``` txt
egg-project
├─ app
│  ├─ router.ts         // 路由配置
│  ├─ controller        // 控制器(处理请求)
│  ├─ service           // (可选)用于编写业务逻辑层
│  ├── middleware       // (可选)中间件
│  ├── schedule         // (可选)定时任务
│  ├── public           // (可选)存放静态资源
│  ├── view             // (可选)页面的模板文件
│  ├── model            // (可选)存放领域模型 https://github.com/eggjs/egg-sequelize
│  └── extend           // (可选)框架的扩展 TODO:https://eggjs.org/zh-cn/basics/extend.html
│      ├── helper.* (可选)
│      ├── request.* (可选)
│      ├── response.* (可选)
│      ├── context.* (可选)
│      ├── application.* (可选)
|      └── agent.* (可选)
│
├─ config               // 针对不同环境的配置文件 (除了config.default和config.prod,其他都是可选的)
│  ├─ config.default.ts
│  ├─ config.local.ts
│  ├─ config.prod.ts
│  └─ plugin.ts         // egg的插件配置
│
├─ test                 // 单元测试
│  └─ app
│      ├─ controller
│      │   └─ home.test.ts
│      └─ service
│          └─ Test.test.ts
│
├── app.js              // (可选)当需要自定义启动脚本时才需要书写
├── agent.js            // (可选)
├─ .autod.conf.js
├─ .eslintignore
├─ .eslintrc
├─ .gitignore
├─ package.json
├─ README.md
└─ tsconfig.json



│
├─ typings            // 不能改动!!!自动生成!
│  └─ **/*
│
```

项目结构是有严格规定的，不能随意修改，因为 egg 就是根据目录结构，对 `ctx` 注入对象。




## 中间件(Middleware)

统一放在 `app/middleware` 目录中。以 `app/middleware/gzip.js` 为例：

``` js
// app/middleware/gzip.js
const isJSON = require('koa-is-json');
const zlib = require('zlib');
module.exports = options => {
  return async function gzip(ctx, next) {
    await next();
    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body;
    if (!body) return;
    // 支持 options.threshold
    if (options.threshold && ctx.length < options.threshold) return;
    if (isJSON(body)) body = JSON.stringify(body);
    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};
```

可以看到，中间件的配置文件，它需要 `exports` 一个普通的 `function`(参数是`options`和`app`) ，返回值是一个异步函数。

然后，在 `app/config/config.default.js` 中配置中间件，还能指定使用的条件：

``` js
module.exports = {
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  middleware: [ 'gzip' ],
  // 配置 gzip 中间件的配置
  gzip: {
    threshold: 1024, // 小于 1k 的响应体不压缩
  },
};
```

注意，**中间件是有序的**，等效于配置的顺序。

在 `config.default.js` 配置的中间件都会被合并到 `app.config.appMiddleware` ，如果想在框架和插件中使用中间件，需要配置到 `app.config.coreMiddleware` ：

``` js
// app.js
module.exports = app => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');
};

// app/middleware/report.js
module.exports = () => {
  return async function (ctx, next) {
    const startTime = Date.now();
    await next();
    // 上报请求时间
    reportTime(Date.now() - startTime);
  }
};
```

应用层定义的中间件(`app.config.appMiddleware`)和框架默认中间件(`app.config.coreMiddleware`)都会被加载器加载，并挂载到 `app.middleware` 上。

注意：**框架和插件**加载的中间件会在**应用层配置**的中间件之前，框架默认中间件**不能被应用层中间件覆盖**，如果应用层有自定义同名中间件，在启动时会报错。


TODO:[框架默认中间件](https://github.com/eggjs/egg/tree/master/app/middleware)


### router 中使用中间件

如果只想对某个路由(接口)使用特定中间件，那就应该在 `app/router.js` 指定中间件配置：

``` js
module.exports = app => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
};
```

### 中间件通用配置项

- `enable`: 控制中间件**是否开启**。
- `match`:  设置只有**符合某些规则**的请求才会**经过**这个中间件。
- `ignore`: 设置**符合某些规则**的请求**不经过**这个中间件。

其中， `match` 和 `ignore` 支持多种类型的配置方式:

- 字符串: 匹配 url 的路径前缀，所有以配置的字符串作为前缀的 url 都会匹配上。
- 数组: 匹配数组拼接成的 url 的路径前缀，类似字符串。
- 正则: 匹配满足正则验证的 url 的路径。
- 函数: 参数是 `ctx` ，返回布尔类型来判断是否匹配。

示例：

``` js
const pathMatching = require('egg-path-matching');
const options = {
  ignore: '/api', // string will use parsed by path-to-regexp
  // support regexp
  ignore: /^\/api/,
  // support function
  ignore: ctx => ctx.path.startsWith('/api'),
  // support Array
  ignore: [ ctx => ctx.path.startsWith('/api'), /^\/foo$/, '/bar'],
  // support match or ignore
  match: '/api',
};

const match = pathMatching(options);
assert(match('/api') === true);
assert(match('/api/hello') === true);
assert(match('/api') === true);
```

</br>

## 路由(Router)

在 `app/router.js` 中配置。常用的请求方法都支持：

| 方法名  | API                          | 备注 |
|---------|------------------------------|------|
| HEAD    | `router.head`                |      |
| OPTIONS | `router.options`             |      |
| GET     | `router.get`                 |      |
| PUT     | `router.put`                 |      |
| POST    | `router.post`                |      |
| PATCH   | `router.patch`               |      |
| DELETE  | `router.delete`/`router.del` |      |
| 重定向  | `router.redirect`            |      |

所有方法的 API 都按如下格式使用（除了`router.redirect`）：

``` js
// 'path-match' 是可选的； middleware 也是可选的
router.<method>('path-match', app.controller.action);
router.<method>('router-name', 'path-match', app.controller.action);
router.<method>('path-match', middleware1, ..., middlewareN, app.controller.action);
router.<method>('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
// 对于 redirect ，示例如下
router.redirect('/', '/home/index', 302);
```

对于重定向，除了 `router.redirect` ，还可以使用 `ctx.redirect` 方法：

``` js
ctx.redirect(`http://example.com`);
```

方法 API 的参数说明：

- `router-name` 给路由设定一个别名，可以通过 Helper 提供的辅助函数 `pathFor` 和 `urlFor` 来生成 URL。(可选)
- `path-match` - 路由 URL 路径。
- `middleware` - 在 Router 里面可以配置多个 Middleware。(可选)
- `controller` - 指定路由映射到的具体的 controller 上，controller 可以有两种写法：
  - `app.controller.user.fetch` - 直接指定一个具体的 controller
  - `'user.fetch'` - 可以简写为字符串形式

关于获取**请求参数**：

- Query String: 如 `/search?name=egg` ，通过 `ctx.query.name` 获取。
- **路径**参数: 如 `app.router.get('/user/:id/:name', controller)` ，通过 `ctx.params.id` 获取。还能使用正则匹配，具体看官网。
- **请求体**参数: 请求体的数据可以有多种类型，需要依赖中间件解析，如 `bodyParser` ，然后通过 `ctx.request.body` 获取被解析后的数据对象。

</br>

## 控制器(Controller)

统一放在 `app/controller` 目录下，支持多级目录，访问的时候可以通过目录名级联访问。

负责**解析**用户的**输入**，处理后**返回**相应的**结果**。

示例：

``` js
// app/controller/post.js
const Controller = require('egg').Controller;
class PostController extends Controller {
  async create() {
    const {
      ctx,      // 请求上下文
      app,      // 应用实例
      service,  // 业务层，等价于 this.ctx.service
      logger    // 日志对象，含有 debug/info/warn/error 4个方法
     } = this;
    const createRule = {
      title: { type: 'string' },
      content: { type: 'string' },
    };
    // 校验参数 (会抛出异常)
    ctx.validate(createRule);
    // 组装参数
    const author = ctx.session.userId;
    const req = Object.assign(ctx.request.body, { author });
    // 调用 Service 进行业务处理
    const res = await service.post.create(req);
    // 设置响应内容和响应状态码
    ctx.body = { id: res.id };
    ctx.status = 201;
  }
}
module.exports = PostController;
```

### 参数获取

无论是哪种参数，都是通过 `this.ctx.*` 获取。

1. `query`: 在 URL 中 `?` 后面的部分是一个 **Query String** ，`query` 对象已经对其封装成对象。

2. `queries`: 假如参数中没有相同字段，效果与 `query` 相同。字段的值会被存放到数组中：
    - 例如 `GET /posts?category=egg&id=1&id=2&id=3`
    - 得到 `{category: ['egg'], id: ['1', '2', '3']}`

3. `params`: 以请求路径作为参数的，就是 **Router params** 。
    - 假设定义了： `app.get('/projects/:projectId/app/:appId', 'app.listApp');`
    - 请求地址 `GET /projects/1/app/2`
    - 得到 `{projectId: '1', appId: '2'}`

4. `body`: 通过请求体传参。
    - 当 Content-Type 为 `application/json` 时，按照 json 格式解析 body 。
      - 同类型的还有 `application/json-patch+json`, `application/vnd.api+json`, `application/csp-report` 。
    - 当 Content-Type 为 `application/x-www-form-urlencoded` 时，按照 form 格式解析 body 。
    - 上面两种情况，默认限制最大长度为 `100kb` 。可以通过 `config/config.default.js` 修改：

      ``` js
      module.exports = {
        bodyParser: {
          jsonLimit: '1mb',
          formLimit: '1mb',
        },
      };
      ```

    - 响应超长会返回 `413` ，解析错误会返回 `400` 。
    - `ctx.body` 是 `ctx.response.body` 的简写。

5. 文件: 浏览器通过 `Multipart/form-data` 格式发送文件。有两种模式：
    - Stream 模式 (默认):
      - 单文件使用 `ctx.getFileStream()` 获取上传的文件流。
      - 多文件使用 `ctx.multipart()` 获取上传的文件流，数据类型就是单文件流的数组。
      - 文件没有正确处理，应该把流消费掉，例子如下：

        ``` js
        const sendToWormhole = require('stream-wormhole');
        class UploaderController extends Controller {
          async upload() {
            // .....
            try {
              // ......
            } catch (err) {
              // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
              await sendToWormhole(stream);
              throw err;
            }
            // .....
          }
        }
        ```

    - File 模式:
      - 需要在 `config.default.js` 中配置 `exports.multipart = {mode: 'file'};`
      - 通过 `ctx.request.files` 可以获取上传的所有文件。
      - 官方建议处理文件后，将临时文件删除: `fs.unlink(file.filepath);`

6. `header`: 获取头部信息。但官方建议使用 `ctx.get(name)` 获取，因为它可以处理大小写。

7. `cookies`: 获取/设置 Cookie 信息。分别是 `get` 和 `set` 方法：
    - `let count = ctx.cookies.get('count') || 0;`
    - `ctx.cookies.set('count', ++count);`

8. `session`: 用来存储用户身份相关的信息，这份信息会加密后存储在 Cookie 中。
    - 读取: `const userId = ctx.session.userId;`
    - 删除: `ctx.session = null;`
    - 在 `config.default.js` 相关配置：

      ``` js
      module.exports = {
        key: 'EGG_SESS', // 承载 Session 的 Cookie 键值对名字
        maxAge: 86400000, // Session 的最大有效时间
      };
      ```

</br>

## 服务(Service)














</br>













