
# 简介

[axios](https://github.com/axios/axios) 是基于 Promise 的 HTTP 客户端，用于 浏览器 和 node.js 。

axios 是基于 Promise 的一个库，所以不支持 Promise 的浏览器(如 IE 11 之前的版本)是无法使用此库。

用法很简单，如发起 GET 请求：

``` js
axios.get(url[, config]).then(response => {
  // 处理响应
}).catch(error => {
  // 处理失败
});
```

此外，还有以下几种方式发起 HTTP 请求：

``` js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

</br>

# axios.all(iterable) 与 axios.spread(callback)

官方对这两个方法并没有过多介绍，实际也没什么用，简单了解就可以了。

`axios.all` 的本质是与 `Promise.all` 相同；而 `axios.spread` 可以作为 `axios.all().then` 的参数。例子如下：

``` js
axios.all([
  axios.request({ url: "/test1" }),
  axios.request({ url: "/test2" }),
  axios.request({ url: "/test3" })
]).then(axios.spread((...responses) => {
  console.log(responses);
}));
```

</br>

# 参数(config)

``` js
axios.request({
  // 请求地址 (除了"axios.request"方法,第一个参数都是url,此属性无效)
  url: '/fetch',
  // 请求方法 (当使用类似于"axios.post"的方法发起请求,此属性无效;此属性默认值是"get")
  method: 'post',
  // 请求的根路径 (当"url"带有协议及主机名等时,此属性无效)
  baseURL: 'http://localhost:3001/testaxios/',
  // 超时时间 (ms)
  timeout: 1000, // 默认0，不设置超时
  // 设置请求头字段
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  // 请求体的数据 (请求方法必须是'PUT','POST','PATCH'中的一种) ，值类型必须是以下一种：
  // - 字符串, 普通对象, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器特有： FormData, File, Blob
  // - Node.js 特有： Stream, Buffer
  data: {
    firstName: 'foo'
  },
  // 对请求数据进行过滤 (请求方法必须是'PUT','POST','PATCH','DELETE'中的一种,返回的数据类型请参考"data"属性)
  transformRequest: [function (data, headers) {
    console.log('transformResponse:', data, headers)
    data.lastName = 'baz'
    return data;
  }],
  // 对响应数据进行过滤
  transformResponse: [function (data) {
    console.log('transformResponse:', data);
    return data;
  }],
  // URL 参数  (必须是普通对象或URLSearchParams)
  params: {
    ID: 12345
  },
  // 对"params"参数进行序列化 (需要返回"?"后的字符串)
  paramsSerializer: function (params) {
    console.log('paramsSerializer:', params);
    return Qs.stringify(params, {
      arrayFormat: 'brackets'
    });
  },
  // 表示是否应该使用凭证发出跨站点访问控制请求 (默认false)
  withCredentials: false,
  // 自定义响应数据 (必须返回promise,详细请看 https://github.com/axios/axios/blob/master/lib/adapters/README.md)
  adapter: function (config) { },
  // 使用 Basic Auth 提供凭据  (写在请求头的"Authorization"属性中)
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
  // 响应的数据类型 (可选值：'arraybuffer','document','json'(默认),'text','stream','blob'(浏览器特有))
  responseType: 'json', // default
  // 响应的解码类型  (默认'utf8')
  responseEncoding: 'utf8',
  // 指定要用作 xsrf 令牌值的 cookie 的名称  (默认'XSRF-TOKEN')
  xsrfCookieName: 'XSRF-TOKEN',
  // 指定携带 xsrf 令牌值的请求头的名称  (默认'X-XSRF-TOKEN')
  xsrfHeaderName: 'X-XSRF-TOKEN',
  // 上传监听器 (可用于"上传文件进度条")
  onUploadProgress: function (progressEvent) {},
  // 下载监听器 (可用于"下载文件进度条")
  onDownloadProgress: function (progressEvent) {},
  // 定义 http 响应内容的最大大小  (单位bytes)
  maxContentLength: 2000,
  // 决定此请求是成功还是失败  (此方法需要返回一个布尔值)
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // 设置 node.js 中最大重定向数 (若设为0,则不重定向) (仅用于node.js)
  maxRedirects: 5, // default
  // 指定 UNIX Socket  ("socketPath"和"proxy"只能设置其中一个) (仅用于node.js)
  socketPath: null, // default
  // 设置代理 (仅用于node.js)
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
  // 指定代理 (仅用于node.js)
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  // 用于取消请求  (具体请查看下面的"取消请求")
  cancelToken: new CancelToken(function (cancel) {})
}).then(res => {});
```

</br>

# 响应(response)

``` js
axios.get('/test').then(response => {
  /**
   * response 包含的属性
   * @member {Object} data 响应数据
   * @member {Number} status HTTP 状态码
   * @member {String} statusText HTTP 状态 (与status相对应)
   * @member {Object} headers 响应头
   * @member {Object} config axios 请求的配置项
   * @member {Object} request 在node.js中是 ClientRequest 实例对象；在浏览器中是 XMLHttpRequest 实例对象
   */
  console.log(response);
})
```

</br>

# 错误处理(error)

``` js
axios.get('/test').catch(error => {
  /**
   * error 包含的属性
   * @member {Boolean} isAxiosError 是否 axios 发出的错误
   * @member {Object} config axios 请求的配置项
   * @member {Object} request 在node.js中是 ClientRequest 实例对象；在浏览器中是 XMLHttpRequest 实例对象
   * @member {Object} response 响应对象 (与"then"参数的"response"相同,可能是undefined)
   * @member {Function} toJSON 无参数，执行后返回一个 JSON 格式化的 error 对象
   */
  console.log(error);
});
```

</br>

# 处理错误

请求或响应都可能发生"错误"，例子如下。

``` js
axios.get('/user/12345').then(res => {})
  .catch(function (error) {
    // 响应的错误  (响应代码不在"合适"的范围内,如400,也可以通过请求配置的"validateStatus"方法修改)
    if (error.response) {
      console.log(error.response.data, error.response.status, error.response.headers);
    }
    // 请求的错误 (请求发出后没有收到响应,"error.request"是XMLHttpRequest或http.ClientRequest的实例)
    else if (error.request) {
      console.log(error.request);
    }
    // 其他错误 (可能是设置中触发的错误)
    else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

</br>

# 全局默认配置

在调用 `axios` 的方法前配置"全局配置"，则会让所有请求都具有默认的配置。 `axios.defaults` 的成员与上面介绍的 [`#参数(config)`](#参数(config)) 相同。

请谨慎配置，因为会影响到所有的 `axios` 请求。

``` js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

</br>

# 创建实例

通过 `axios.create(config)` 可以创建 `axios` 实例对象，实例对象与 `axios` 的属性方法相同。

创建 `axios` 实例对象时，可以传入初始参数，其他参数则使用"全局默认配置"。

``` js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
instance.get('/test').then(res => {});
```

</br>

# 拦截器(Interceptors)

拦截器的作用是对请求或响应的数据进行格式化。

通过 `axios.interceptors.*.use()` 添加拦截器，通过 `axios.interceptors.*.eject()` 删除指定拦截器。

可以对 `axios` 实例添加拦截器，也可以对全局 `axios` 添加拦截器。但"全局"的拦截器不会作用于"实例对象"。

**"后"添加** 的拦截器会 **"先"触发**。

``` js
// 添加 请求 拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
// 添加 响应 拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});
// 可以针对某个 axios 实例添加拦截器
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
// 除了添加拦截器，还能删除拦截器
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

</br>

# 取消请求(cancelToken)

"取消请求" 是根据 `source.token` 来处理的，通过调用 `source.cancel()` 取消相关的请求。

注意， get 请求的时候， `cancelToken` 是放在第二个参数里； post 的时候， `cancelToken` 是放在第三个参数里。

``` js
// 取消所有请求
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else { /* handle error */ }
});
axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
});
source.cancel('Operation canceled by the user.');

// 只取消单个请求
const CancelToken = axios.CancelToken;
let cancel;
axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c; // 取消函数
  });
});
cancel();
```

</br>

# demo 说明

- `browse_demo` 目录下是浏览器使用 axios 的 demo 。在该目录下运行 `node app.js` 启动服务器。浏览器打开 [http://localhost:3001](http://localhost:3001) 。注意，此 demo 需要联网获取 `axios.min.js` 文件。

- `server_demo` 目录下是 node.js 使用 axios 的 demo 。在该目录下开启两个控制台，分别运行 `node app_client.js` 和 `node app_server.js` 启动客户端和服务端。在启动客户端的控制台输入对应指令查看效果。
