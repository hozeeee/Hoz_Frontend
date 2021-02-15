
# 简述

[Push API](https://developer.mozilla.org/zh-CN/docs/Web/API/Push_API) 可以让服务器随时推送消息到浏览器(前提是已获取用户允许)。除了用户的浏览器和你的服务器，这过程还涉及"消息服务器"，你推送到浏览器的消息必须经过消息服务器。

浏览器、你的服务器、消息服务器 三者的关系如下：

``` txt
 ┌→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→(3. 把订阅详情存储到服务器)→→→→→→→┐
 ↑  ┌←←←(5. 消息服务器再把消息转发到指定浏览器)←←←┐                                        ↓
 ↑  ↓                                          ↑          (4. 在第3步之后,就可           ↓
浏览器 →→→→→→→→→→→(★1. 创建订阅)→→→→→→→→→→→ 消息服务器 ←←←  以利用"订阅详情"把消  ←←← 你的服务器
 ↑                                             ↓           息发送到消息服务器 )
 └←←←←←←←←←←←←←←←(2. 返回订阅详情)←←←←←←←←←←←←←←┘
```

**注意，"消息服务器"是由各浏览器提供，且无法修改。**

</br>

# 获取 PushManager

Push API 依赖一个已激活的 service worker 。通过 `ServiceWorkerRegistration.pushManager` 可以获取到 pushManager 。

遗憾的是，就目前测(2019.12)试情况来说， **PushManager 只有桌面版的 Firefox 支持**。

``` js
// 通过 ServiceWorkerGlobalScope.registration 获取 pushManager (serviceWorker中)
let pushManager = self.registration.pushManager

// 通过 navigator.serviceWorker.ready 获取 (页面中)
navigator.serviceWorker.ready.then(registration => {
    // chrome 虽然有 pushManager
    let pushManager = registration.pushManager
})
```

</br>

# 生成密钥

为了使用消息服务器，我们需要创建密钥。用于签名和验证推送消息的密钥成为 **VAPID 密钥** ，是"资源的 Web 推送应用服务器身份证明"。

## 生成 VAPID 的公钥和私钥

  下面代码依赖 web-push 库，需要提前安装好。

  ``` js
  let webpush = require('web-push');
  console.log(
    // 修改为你的域名
    webpush.generateVAPIDKeys('https://10.108.143.66:3011')
  )
  ```

  执行上面命令后，会在控制台得到类似如下的一对公钥/私钥。

  ``` shell
  {
    publicKey: 'BFvLJ_hqtFAdVtULXfYP8OesO8X-edNNqBtXFVISbcUEUrRGDv8YDWZvW9m4H8uWZ1HR1ID6-ZvQ247BRZX6DB0',
    privateKey: 'pZsHwTi6O2F8qFTow4oI_ehYXmM6Rut58FQNcqkq5yM'
  }
  ```

  在服务器的根目录下，创建 push-keys.js 文件，填上如下内容： (为了保证安全,请把此文件添加到.gitignore中)

  ``` js
  module.exports = {
    subject: 'https://10.108.143.66:3011/',
    publicKey: 'BFvLJ_hqtFAdVtULXfYP8OesO8X-edNNqBtXFVISbcUEUrRGDv8YDWZvW9m4H8uWZ1HR1ID6-ZvQ247BRZX6DB0',
    privateKey: 'pZsHwTi6O2F8qFTow4oI_ehYXmM6Rut58FQNcqkq5yM'
  }
  ```

## 生成 GCM 密钥 （现在是FCM）

**注意，关于这部分内容没有实践，实际操作可能跟下面描述的有所区别，请自行查阅资料。且，国内对 FCM 也不友好，被墙了。**

版本42到51的Chrome 、 Opera 、 三星浏览器 都使用了谷歌云消息(Goolgle Cloud Message, GCM)来推送消息。为了更好兼容性，我们也需要获取 GCM API 密钥。

1. 从 [https://console.firebase.google.com](https://console.firebase.google.com) 登陆 Firebase 控制台 (国内需要科学上网)

2. 使用谷歌账号登陆后，按提示创建项目即可

3. 点击进入刚创建的项目，在"设置"中找到 "Cloud Messaging"(云消息传递)

4. 找到 "生成密钥" 按钮，点击后就可以获得 GCM 服务端密钥

5. 把密钥和管理员邮箱添加到 push-keys.js 文件中

    ``` js
    module.exports = {
    GCMAPIKey: '...',
    subject: 'https://10.108.143.66:3011/',
    publicKey: 'BFvLJ_hqtFAdVtULXfYP8OesO8X-edNNqBtXFVISbcUEUrRGDv8YDWZvW9m4H8uWZ1HR1ID6-ZvQ247BRZX6DB0',
    privateKey: 'pZsHwTi6O2F8qFTow4oI_ehYXmM6Rut58FQNcqkq5yM'
    }
    ```

6. 在 manifest.json 文件，添加一个名为 gcm_sender_id 的选项，填上我们刚才创建项目的"发送者ID"：

    ``` json
    {
        ...
        "gcm_sender_id": "11111"
    }
    ```

</br>

# 页面订阅消息

``` js
// 此函数作用：将 VAPID 公钥转换成 pushManager 所需的 Uint8Array 类型 (可以忽略其内部实现,除非你对密码学感兴趣)
function urlBase64ToUint8Array(base64String: string) {
  var padding = "=".repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray
}
// 封装"创建订阅"
function subscribeUserToNotification() {
  // 获取推送消息的权限
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') throw '推送消息权限获取失败'
    return navigator.serviceWorker.ready
  }).then(registration => {
    // 提交订阅 (注意,虽然chrome也有这个方法,返回的也是Promise,但它永远会处于"pending"状态)
    return registration.pushManager.subscribe({
      // 必须设为 true ，否则消息服务器会报错，这是因为涉及用户隐私问题。
      userVisibleOnly: true,
      // 将 VAPID 转换成 Uint8Array 类型
      applicationServerKey: urlBase64ToUint8Array('BFvLJ_hqtFAdVtULXfYP8OesO8X-edNNqBtXFVISbcUEUrRGDv8YDWZvW9m4H8uWZ1HR1ID6-ZvQ247BRZX6DB0')
    })
  }).then(subscribe => {
    // 此时，页面已经订阅了推送消息
    console.log(subscribe);
    // 把"订阅详情"发送到服务器保存
    return fetch('/add-subscription', {
      method: 'post',
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(subscribe)
    })
  }).then(_ => {
    console.log('成功订阅')
  }).catch(err => {
    console.error(err)
  })
}
```

</br>

# 服务端发送消息

采用 VAPID ，以 GCM 为回退方案。

``` js
const webpush = require('web-push');
// 还记得我们前面创建的这个文件吗？包含密钥
const pushKeys = require('./push-keys.js');
// 页面发送过来的"订阅详情" (应该保存在数据库,在数据库读取)
const subscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/sdfwefrgsafsdf",
  keys: {
    p256dh: "sfewgrhdafgerfewfsf",
    auth: "werfwefsdgas"
  }
}
// 配置 GCM (不用可忽略)
webpush.setGCMAPIKey(pushKeys.GCMAPIKey)
// 配置 VAPID
webpush.setVapidDetails(
  pushKeys.subject,
  pushKeys.publicKey,
  pushKeys.privateKey
)
// 发送消息
webpush.sendNotification(subscription, '发送给页面的消息').then(_ => {
  // 注意,此时并不代表消息已经成功发送给用户。有可能用户离线或撤销了应用的通知权限。
  console.log('推送消息发送成功')
}).catch(_ => {
  console.log('推送消息发送失败')
})
```

</br>

# 页面监听推送事件并显示通知

``` js
self.addEventListener("push", e => {
  // e.data 返回的是一个 respond 对象，该对象上除了 text() 方法获取文本，还有 .json() 方法把JSON字符串转成对象，具体看服务器的返回
  let msg = e.data.text()
  // 弹出通知
  self.registration.showNotification('Push message received', {
    body: msg
  })
})
```
