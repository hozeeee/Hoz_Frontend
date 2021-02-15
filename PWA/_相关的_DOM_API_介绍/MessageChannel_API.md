
# 简介

MessageChannel 的内容很少。想象一下，你是有两台电话的人，想和一个没电话的保持联系，你就需要把一个电话给他。 MessageChannel 的使用也是类似的。

# postMessage()

在介绍 MessageChannel 之前，先介绍 `postMessage()` 方法的使用，它可以实现 service worker 与 页面 之间的单次通信。

## 页面 向 service worker 发送消息

``` js
// "navigator.serviceWorker.contorller"获取当前控制页面的 serviceWorker
// 然后通过 .postMessage(<any>) 方法发送数据
navigator.serviceWorker.contorller.postMessage(
  { key1: 'value1', key2: 'value2' }  // 这里可以传任意类型的数据
);

// serviceWorker 内监听消息
self.addEventListener('message', e => {
  console.log(e.data)   // 通过 e.data 获取数据
});
```

需要注意的是，当用户第一打开页面，当前并不存在控制页面的 service worker，此时的 `navigator.serviceWorker.contorller` 值为 `undefined` ，因此使用 `postMessage()` 会报错。

## service worker 向 所有页面 发送消息

- 向所有窗口发送消息

  ``` js
  /**
   * 查询特定窗口对象
   * @function Clients.matchAll(options?)
   * @param {includeUncontrolled?, type?} options 匹配操作设置选项 (省缺时查询所有)
   *    sub@param {Boolean} includeUncontrolled 是否返回与当前服务工作者共享相同源的所有服务工作者客户端
   *    sub@param {Enum} type 设置想要匹配的clients类型,可用值包括 window, worker, sharedworker, all(默认)
   * @returns {Promise<Array[WindowClient]>}
   */
  self.clients.matchAll().then(clents => {
    let urls = clients.map(client => client.url)
    console.log(urls)
  })

  // 页面获取消息
  navigator.serviceWorker.addEventListener('message', e => {
    console.log(e.data)   // 同样通过 e.data 获取数据
  })
  ```

- 当我们已知某个窗口的 id，就可以只向该窗口发送消息

  ``` js
  // 获取特定的窗口对象
  self.clients.get(clientId).then(client => {
    client.postMessage('啊~~~~')
  })
  // 获取 窗口id 的方法：
  // 方法一
  self.clients.matchAll().then(clients => {
    let clientIds = clients.map(c => c.id)
  })
  // 方法二
  self.addEventListener('message', e => {
    let clientId = e.source.id
  })
  ```

## 使用 MessageChannel 保持通信渠道打开

第一步先创建 MessageChannel 实例对象，然后通过 `postMessage()` 发给 service worker 。

``` js
/* ---------- 页面 ---------- */
// 1. 页面创建一个"电话" (监听port1端口)
let msgChan = new MessageChannel();
msgChan.port1.onmessage = e => {
  console.log('来自 service worker 的消息', e.data)
}
// 2. 页面把"电话"给 serviceWorker (.postMessage的第二个参数传递)
navigator.serviceWorker.controller.postMessage(
  '保持通话,得闲饮茶',
  [msgChan.port2]
)

/* ----- service worker ----- */
// 3. serviceWorker 接收并保存"电话"
let openPort;
self.addEventListener('message', e => {
  openPort = e.ports[0]
})
// 4. serviceWorker 使用"电话"与页面保持通信
function usePort(msg){
  if(!openPort) return;
  openPort.postMessage(msg)
}
```