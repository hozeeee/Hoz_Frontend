
# 理论

node.js 是基于 chrome V8 的 runtime 。

node.js 官方的规范，对调函数的第一个参数必定是 error 对象，我们可以对第一个参数判断，得知函数是否报错。

查看官方文档的技巧是：打印对象，可以看到是哪个"类"，再去官网查询。

可以同时安装多个版本的 node.js ，能在不同版本之间切换。需要依赖 nvm ， nvm 是 node.js 的版本管理工具。

每个 node.js 执行文件中，都有 `__dirname` 变量指向文件所在的目录。

node.js 使用的是 CommonJS 模块规范。通过 `module.exports={}` 抛出模块，通过 `require()` 引入模块。

</br>
</br>
</br>

# process

## process.argv

此属性用于获取**执行 node 文件时携带的参数**。

测试方法：

1. 创建 `test.js` 文件，在文件内写入一行代码 `console.log(process.argv);`
2. 控制台运行 `node test abcd 1234`
3. 控制台会打印如下信息：

``` js
[ 'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\asus\\Desktop\\node_demo\\test',
  'abcd',
  '1234' ]
```

上述例子可以看到，数组的前两个元素分别是 node.exe 和 执行文件 的地址；后面的元素则依次是你输入的参数。

## process.stdin 、 process.stdout 、 process.exit()

这两个属性分别是处理输入输出流。当我们在执行文件中添加 `process.stdin.on(callback)` 监听器，执行脚本后，该程序就能**持久化**，并且能监听用户的输入，在控制台输出响应的代码。通过 `process.exit()` 可以杀死当前进程。

``` js (dobule.js)
// 指定输入流的编码格式
process.stdin.setEncoding('utf8');
// 监听输入流 (会使得此脚本"持久化")
process.stdin.on('data', input => {
  // 注意，当输入结束时会按"回车"，导致输入流的结尾是"\r\n"，不能用"==="判断
  if (input.includes('exit')) {
    // "杀死"进程
    process.exit();
  }
  // 若未通过 setEncoding 方法设置编码格式，input 是一个 Buffer
  let num = Number.parseFloat(input);
  if (Number.isNaN(num)) {
    // 输出"错误流"
    process.stderr.write('请输入数字\r\n');
  } else {
    // 使用"输出流"输出到控制台 (等效于console.log)
    num *= 2
    process.stdout.write(num.toString() + '\r\n');
  }
});
```

``` shell
> node dobule.js
> abc
请输入数字
> 234
468
> exit

```

</br>
</br>
</br>

# Event Loop

略。

</br>
</br>
</br>

# npm

TODO:

</br>
</br>
</br>

# 本地文件读写

node.js 对本地文件读写，主要使用 **`fs` 内置模块**。可以理解为对文件(夹)的增删改查。

`fs` 的 API 基本都有"同步"和"异步"两个版本，名称上的区别就是"同步"方法有 `Sync` 后缀。如 `mkdir()` 是异步创建文件夹； `mkdirSync()` 是同步创建文件夹。

异步的形式总是将完成回调作为其**最后一个参数**。 传给完成回调的参数取决于具体方法，但**第一个参数**始终预留用于异常。 如果操作成功完成，则第一个参数将为 `null` 或 `undefined` 。

TODO:

</br>
</br>
</br>

# 服务器

node.js 可以作为 BFF 层。 BFF(Backend for Frontend) 层，是后台与前端的一个中间层，用于组装后台数据。该层就两个功能：

- 对用户侧提供 HTTP 服务
- 使用后端 RPC 服务

node.js 作为服务器的优势是：

1. 事件驱动
2. 非阻塞 IO
3. 优点：高并发特别好（但 python 更好）

概念解析：
    - 什么是高并发：同时接收到大量的请求。
    - 什么是IO：指 input 和 output ，即输入输出，正常的的 IO 操作都是阻塞的，如网络请求、数据库处理、文件的读写等。

## HTTP 协议

TODO:

## http 内置模块

创建 HTTP 服务。

## querystring 内置模块

用于对 url 的编码的解码。url 中，需要对中文(或其他语言)、特殊字符等进行编码，编码的结果的百分号加上编码，如 `%20` 表示的是空格。

- parse() 用法如下，把查询字符串转成对象。其中，此方法还有两个参数，用于解析"奇怪"的查询字符串(详见官网)。

  ``` js
  const qs = require('querystring');
  let str = 'username=张三&password=1234';
  let result = qs.parse(str);
  console.log(result);  // { username: '张三', password: '1234' }
  ```

- stringify() 用于把一个对象转成 query 字符串，其中特殊符号会自动转码。

  ``` js
  let queryStr = qs.stringify(result);
  console.log(queryStr);  // username=%E5%BC%A0%E4%B8%89&password=1234
  ```

- escape() 与 unescape() ，分别是转义和解码。

  ``` js
  let str1 = '你好';
  // 转义
  let str2 = qs.escape(str1);
  console.log(str2);  // %E4%BD%A0%E5%A5%BD
  // 解码
  let str3 = qs.unescape(str2);
  console.log(str3);  // 你好
  ```

## express

express 是 node.js 服务器框架。具体请看 [另一个demo](./express) 。

## koa

koa 也是 node.js 服务器框架。具体请看 [另一个demo](./koa) 。

## RPC

RPC(Remote Procedure Call) 远程过程调用，简单说就是用于转发的代理服务器，协议一般不使用 HTTP 协议(即不使用 DNS 进行域名解析)，基于 TCP 或 UDP 协议，使用特有的服务进行寻址。

### Buffer

Buffer 的每位都是**两位的 16 进制**，即每位 Buffer **1 字节**。

buffer 的创建：

``` js
// 根据字符长度，生成对应的 buffer
const buffer1 = Buffer.from('hello world');
// 数组每个成员都占一位buffer (可能会溢出)
const buffer2 = Buffer.from([1, 16, 3]);
// 创建长度为10的空buffer
const buffer3 = Buffer.alloc(10);
// 结果打印：
console.log(buffer1); // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
console.log(buffer2); // <Buffer 01 10 03>
console.log(buffer3); // <Buffer 00 00 00 00 00 00 00 00 00 00>
```

相关 node 库： [`protocol-buffers`](https://www.npmjs.com/package/protocol-buffers) ，用于"编码"和"解码"特定数据结构的 buffer 。

``` js
const protobuf = require('protocol-buffers');
const fs = require('fs');
// 读取 数据结构 文件
const messages = protobuf(fs.readFileSync('./test.proto'));
// 以特定数据结构"编码"buffer  (注意,Person是.proto文件中定义的)
const buffer4 = messages.Person.encode({
  id: 111,
  name: 'baz',
  age: 20.3
});
// 以特定的数据结构"解码"buffer
let data = messages.Person.decode(buffer4);
// 结果打印：
console.log(buffer4); // <Buffer 08 6f 02 03 62 61 7a 95 01 66 66 a2 41>
console.log(data);  // { id: 111, name: 'baz', age: 20.299999237060547 }
```

### net 内置模块

通过 net 内置模块可以创建服务端和客户端的全双工通信。

使用 net 创建连接和 http 内置模块类似，都是通过 `createServer()` 和 `connect()` 方法分别创建服务端和客户端。具体例子请看 [net_demo](./net_demo) 。

## HTTP 服务性能

### 压力测试

工具： `ab`(apache bench) 、 `webbench` 。

httpd-tools

TODO:

### 性能分析

方法一： node 自带的工具

1. 运行命令 `node --prof app.js` 启动服务器，同目录下会多出一个 `****.log` 文件。

2. 启动**压力测试**， `.log` 文件中会自动收集记录数据。

3. 停掉服务器，运行命令 `node --prof-process ****.log > profile.txt` 对 log 文件分析，在同目录下会生成 `profile.txt` 文件。

4. 查看 `profile.txt` 文件的内容就是**性能分析报告**，主要看 `[Bottom up (heavy) profile]` 部分的内容。

方法二： Chrome devtool

1. 运行命令 `node --inspect-brk app.js` 启动服务器，其中 `--inspect-brk` 表示启用调试的同时会暂停代码的执行，待进入调试工具后再自动往下执行。

2. 执行完上一步之后，会监听一个 websocket 的地址，如`ws://127.0.0.1:9229/sdfwehgd123fsd`，使用Chrome浏览器打开 `chrome://inspect` ，会看到 node 服务器程序，点击 "inspect" 按钮打开调试面板。

3. 在调试面板的"Profiler"页，点击左上角的"小圆点"开始记录测试。

4. 启动**压力测试**。

5. 压力测试结束后，在Chrome调试面板中再次点击"小圆点"停止录制，然后就能看到性能分析报告了。

### 性能优化

主要是两点：**减少不必要的计算**；**空间换时间**。例如，把文件资源在启动时就读取，保存到内存中，就不必每次请求都读取文件。

</br>
</br>
</br>

# API 服务

## RESTful

简单易懂，特定接口返回特定数据；可以快速搭建；但在数据聚合方面有很大劣势。

## GraphQL

专注于数据聚合，前端需要什么就返回什么。

需要安装 `graphql` 库。

TODO: 做实例

koa-graphql

</br>
</br>
</br>

# 子进程与线程

进程：是操作系统挂载运行程序的单元，其拥有一些独立的资源，如内存等。举例说，启动一个nodejs程序，就是启动一个进程。

线程：是进程运算调度的单元，同一个进程内的线程资源共享。

## child_process

## worker_threads

## cluster

</br>
</br>
</br>

# 上面并未介绍的内置模块

## url 模块

通过构造函数 `new URL()` ，传入`"http://192.168.1.1:8080/home/node?user=lisi&pass=1234#hash"` 会得到如下是一个 url 对象：

``` js
Url {
  protocol: 'http:',  // 协议
  slashes: true,
  auth: null,
  host: '192.168.1.1:8080', // 主机
  port: '8080',             // 端口号
  hostname: '192.168.1.1',  // 主机名
  hash: '#hash',  // 哈希值
  search: '?user=lisi&pass=1234',
  query: 'user=lisi&pass=1234',   // 查询参数
  pathname: '/home/node',         // 路径名
  path: '/home/node?user=lisi&pass=1234', // 完整路径
  href: 'http://192.168.1.1:8080/home/node?user=lisi&pass=1234#hash'  // 完整 url
}
```

可以看出，常用的有：协议、主机名、端口号、路径、路径名、查询参数、哈希值。其中，路径包含路径名和查询参数。

与 `new URL()` 方法相对应的是 `url.format()` ，把一个 url 对象转成 url 字符串。

## events

大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构。事件都是基于此内置模块。

详细的介绍都在 [demo](./eventEmitter_demo/events.js) 中。

## path

此模块用于生成路径字符串。最为常用的是 `path.join(__dirname, path1);` 生成绝对路径。

其中 `__dirname` 是每个 nodejs 执行文件自带的变量，指向当前文件所在目录的绝对路径。

其他 API 可以查阅 [官网](http://nodejs.cn/api/path.html#path_path_join_paths) 。

</br>
</br>
</br>

# 优秀的第三方模块

TODO:有空做实例

## nodemailer

发送邮件的插件，可以用于发送验证码给用户。具体不展开细说。

## multer

是一个 node 的中间件，用于解析上传的二进制流。

## cheerio

把 html 字符串格式化成类 DOM 对象，语法类似于 jQuery 的语法。

``` js
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">hello</h2>');
let str = $('h2.title').text();
// hello
console.log(str);
```

## apidoc

用于自动生成api文档(需要写注释)


glob 库

nodemon 库，自动重启 node 服务

easy_sock 库

Next.js 库，使得 React 服务端渲染更简单。
