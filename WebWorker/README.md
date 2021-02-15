
# 简介

通过使用 Web Workers ， Web 应用程序可以在独立于主线程的后台线程中，运行一个脚本操作。这样做的好处是可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）**不会因此被阻塞/放慢**。

这里是 [MDN 的文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 介绍。

用法很简单：

1. 通过构造函数创建 worker 对象： `let worker = new Worker('/worker.js');` 。

2. 通过 `worker.postMessage()` 向 Web Workers 发送数据， Web Workers 收到数据后进行特定操作。

3. 然后通过其全局方法 `postMessage()` 把数据返回给页面。

# demo 介绍

`app.js` 文件可以忽略不看，只是搭建一个简单的 HTTP 服务器。

主要查看 [`worker.js`](./worker.js) 和 [`index.html`](./index.html) 文件的 `<script>` 的代码。

demo 要实现的效果也很简单，证明复杂计算可以放在 Web Workers 中，达到不会阻塞页面渲染的主线程的效果。
