
# demo 启动说明

在两个控制台窗口分别启动 `app.js` 和 `app2.js` ，然后打开 `http://localhost:3000` 获取测试页面。

</br>

# MDN的介绍

[HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

</br>

# 简单请求

某些请求不会触发 CORS **预检请求**。暂且称这样的请求为"简单请求"。

符合如下**所有条件**的为"简单请求"：

1. 请求方法为如下之一：
    - GET
    - POST
    - HEAD

2. Fetch 规范定义了对 CORS 安全的首部字段集合，不得人为设置该集合之外的其他首部字段。该集合为：
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type （需要注意额外的限制）
    - DPR
    - Downlink
    - Save-Data
    - Viewport-Width
    - Width

3. 请求头中 `Content-Type` 的值仅限于下列三者之一：
    - text/plain
    - multipart/form-data
    - application/x-www-form-urlencoded

4. 请求中的任意 `XMLHttpRequestUpload` 对象均没有注册任何事件监听器；`XMLHttpRequestUpload` 对象可以使用 `XMLHttpRequest.upload` 属性访问。

5. 请求中没有使用 `ReadableStream` 对象。

</br>

# 非简单请求

凡是不符合的"简单请求"的都是非简单请求，非简单请求会触发**预检请求**，就是在请求实际数据前会多出一个请求方法为 `OPTIONS` 的一个请求。预检请求会在一定时间内有效，有效时间内再次发起的跨域请求不会重复发起预检请求。

</br>

# 相关的 HTTP 响应首部字段

要实现跨域，服务器必须要设置特定的响应头，这样才能通过浏览器的验证，否则会被浏览器拦截。其中 **Access-Control-Allow-Origin** 是必须的，其他都是视情况而配置的。

相关的HTTP响应头字段如下：

1. **Access-Control-Allow-Origin**: `<origin>` | "*"
    `<origin>`表示允许请求的域，如`"http://localhost:4000"`；而`"*"`则表示允许所有域的请求。

2. **Access-Control-Expose-Headers**\
    默认情况下，`XMLHttpRequest`对象的`getResponseHeader()`方法只能拿到一些最基本的响应头（Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma）。如果浏览器要访问其他头，需要服务器响应配置此响应头。需要显示哪些额外的头，就设置指定的该头的值，多个值之间用逗号分隔。

3. **Access-Control-Allow-Methods**\
    默认情况下，`XMLHttpRequest`发起的请求只能使用 GET、POST、HEAD ，除此外则需要服务器配置此属性。多个值之间用逗号分隔。

4. **Access-Control-Allow-Credentials**\
    当浏览器将`XMLHttpRequest`的`withCredentials`标志设置为`true`时，请求将携带cookie。此时，服务器响应需要配置此属性为`true`，否则数据会被浏览器拦截。（注意，`Access-Control-Allow-Origin`的值不能为`"*"`）

5. **Access-Control-Expose-Headers**\
    若浏览器请求中配置了除默认的允许的请求头（详见[简单请求](#简单请求)的第2点）额外的头，则服务器则需要配置此响应头，用于预检请求的响应，指明实际请求中允许携带的头。

6. **Access-Control-Max-Age**\
    制定了 preflight请求（预检请求）的结果能够被缓存多久。单位是秒，默认 5 秒。

</br>

# HTTP 请求首部字段

注意，以下列出的请求头字段，**无需手动设置**，使用`XMLHttpRequest`对象发起跨域请求时，它们已经被设置就绪。只作为了解即可。

1. **Origin**\
    表明预检请求或实际请求的源站。它不包含任何路径信息，只是服务器名称。

2. **Access-Control-Request-Method**\
    将实际请求所使用的 HTTP 方法告诉服务器。

3. **Access-Control-Request-Headers**\
    将实际请求所携带的首部字段告诉服务器。
