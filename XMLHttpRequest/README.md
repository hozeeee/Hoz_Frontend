
# 项目运行说明

1. `npm i` 安装包依赖
2. `node app` 启动服务器
3. 打开[主页](http://localhost:3000)

主要查看 [`index.html`](./index.html) 的 `<script>` 代码。

# API 简单介绍

``` js
// 创建实例(无参数)
let xhr = new XMLHttpRequest()

// 指定请求的方法和地址
xhr.open('GET', '/static/test.png');

// 还能重写返回数据的MIME类型，会取代服务器设定的值，若不设置则以服务器的值为准，否则为"text/xml"。（一般不设定，使用服务器提供的值即可）
// xhr.overrideMimeType("image/png");

// 设置请求头 (可选)
xhr.setRequestHeader("my-header", "my-value");

// 当跨域时，是否携带cookie，默认为 false 。当同源请求时，忽略此值。
xhr.withCredentials = true

/**
 * 设置请求超时时间。
 * 单位ms，值为非零整数。默认为0，表示没有超时。
 * 注意：只能在 异步请求 中设置该值；超时后会触发 "timeout" 事件。
 */
xhr.timeout = 2000;

// 设置响应类型为 blob 。值为枚举。默认为""，与"text"一致，表示数据是DOMString类型。此外还有arraybuffer、document、json。
xhr.responseType = 'blob'

// 监听事件
xhr.addEventListener('readystatechange', e => {
  let _target = e.target
  /**
   * 判断状态是否为已完成
   * .readyState 获取的是下载状态，4 表示下载完成，也就是 XMLHttpRequest.DONE 的值
   * .status 表示响应的状态码
   * .response 表示响应的正文内容。其数据类型可以是 ArrayBuffer、Blob、Document、JavaScript Object或DOMString，取决于responseType属性。
   */
  if (_target.readyState === XMLHttpRequest.DONE && _target.status === 200) {
    // ...
  }
});

// 最后必须发送
xhr.send();
```
