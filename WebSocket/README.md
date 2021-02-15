
# 简介

WebSocket 提供客户端与服务端保持通信的方法。有了它，服务器就可以主动向客户端推送消息。

还有一点需要说的， WebSocket 不存在跨域问题。

前端的 WebSocket 可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 的介绍。主要是通过 `new WebSocket(url [, protocols])` 创建连接。

比较好的一个库是 [**ws**](https://github.com/websockets/ws) ，可用于服务端也可以用于客户端，但不能用于前端。具体介绍可以看 [API 文档](https://github.com/websockets/ws/blob/master/doc/ws.md)。

但 WebSocket 需要浏览器的支持，如果是比较旧的设备，可以考虑 **`socket.io`** 。

# deomo

下面是 demo 的简单介绍，具体请到对应的目录下查看。

## demo1_ws

先执行 `node server.js` ，然后在另一个 shell 执行 `node client.js` 。看控制台打印结果

## demo2_ws

在此 demo 中，演示了多个服务共享一个 HTTP/S 服务器。

主要是先创建一个 HTTP/S 服务器，和若干个 WebSocket 服务，使用 `noServer: true` 参数开启"不启用服务器模式"。当连接需要时升级为 WebSocket 。
