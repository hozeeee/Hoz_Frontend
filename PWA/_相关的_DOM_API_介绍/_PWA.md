
# 简介

[PWA](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)（Progressive web apps，渐进式 Web 应用）运用现代的 Web API 以及传统的渐进式增强策略来创建跨平台 Web 应用程序。这些应用无处不在、功能丰富，使其具有与原生应用相同的用户体验优势。

PWA 是可被发现、易安装、可链接、独立于网络、渐进式、可重用、响应性和安全的。

但在国内的情况并不好，因为兼容性、谷歌被墙、某些API不统一等情况。

</br>
</br>
</br>

# IndexedDB API

浏览器的一个本地数据库，[查看详细](../../IndexedDB) 。

</br>
</br>
</br>

# service worker

service worker 是 PWA 的核心。[查看详细](./ServiceWorker_API.md)。必须依赖 service worker 的 API 如下：

## .postMessage() 与 MessageChannel

用于 service worker 有 页面 之间的通信。[查看详细](./MessageChannel_API.md)

## Notification

推送消息用于推送通知消息，[查看详细](./Notification_API.md)。

## SyncManager

当用户处于离线时，提供临时保存请求，网络恢复自动重发请求的功能，[查看详细](./SyncManager_API.md)。

</br>
</br>
</br>

# CacheStorage API

缓存接口，可以在离线时使用特定资源，[查看详细](./CacheStorage_API.md)。

</br>
</br>
</br>

# 添加到主屏幕（A2HS）

添加到主屏幕（A2HS）添加到主屏幕（简称A2HS）是现代智能手机浏览器中的一项功能，使开发人员可以轻松便捷地将自己喜欢的 Web 应用程序（或网站）的快捷方式添加到主屏幕中，以便他们随后可以通过单点访问它。想了解更多，可以到 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps) 看文档，下面内容的一部分也来自于该文档。

## 兼容性

Mobile Chrome / Android Webview 从31版开始支持A2HS，Opera for Android从32版开始支持，Firefox for Android从58版开始支持。

## 使用 A2HS 的前提条件

- 应用通过 HTTPs 提供服务 (这也是使用 service worker 的前提条件)。
- 从 HTML 头链接具有正确字段的 manifest 文件，即 `<link rel="manifest" href="/manifest.json">`。
- 有合适的图标可显示在主屏幕上 (在 manifest.json 中指定)。
- Chrome 浏览器还要求该应用程序注册一个 service worker (例如，使其在离线状态下可以运行)。

## manifest.json 字段介绍

``` json
{
    // 清单文件必须包含"name"或"short_name"属性，或两者都有。空间足够时显示全名，否则显示短名。
    "name": "string.........",        // 应用全名
    "short_name": "string",           // 应用名简称
    "start_url": "/subpage?param=1",  // 点击图标时打开的路径，可以是根域名，也可以内部页面
    // Web 应用可使用的图标组
    "icons": [
        {
            "src": "/img/icon1.png",  // 图标的(绝对或相对)路径
            "type": "image/png",      // 文件类型(MIME)
            "sizes": "192x192",       // 像素尺寸 (要触发Web安装横条,清单中至少包含一个144x144的图标) (注意格式,中间的"乘号"是小写英文字母x)
        }
    ],
    "display": "browser",             // 应用启动时的显示模式 (可选值："browser"->浏览器中打开;"standalone"->不显示浏览器栏;"fullscreen"->全屏,即不显示浏览器栏和设备栏) 要显示安装横幅,值不能是"browser"
    /* ------------------ 上面的属性必须满足，下面属性是可选的 ------------------ */
    "description": "....",            // 应用的描述
    "orientation": "auto",            // 强制指定屏幕方向 (可选值："landscape"->风景/横屏;"protrait"->肖像/竖屏;"auto")
    "theme_color": "#aaa",            // 主题颜色 (注意,<meta name="theme-color" content="#bbb">的优先级比此属性要高)
    "background_color": "blue",       // 启动画面以及加载时的背景色
    "scope": "/full/standalone",      // 定义应用的作用域 (超出作用域时,在浏览器新窗口打开)
    "dir": "ltr",                     // 显示"name"、"short_name"、"description"参数文本的方向，默认与路i兰奇语言一致 (可选值："ltr"->从左到右;"rtl"->从右到左;"auto")
    "lang": "en",                     // 指定"name"、"short_name"、"description"参数文本的语言
    "prefer_related_applications": true,  // 当你希望用户安装你的原生应用，而非 Web 应用，把此属性设为 true (需要配合"related_applications"使用)
    "related_applications": [
        {
            "platform": "play",     // 平台参数 (如play、itunes)
            "url": "https://...",   // 应用下载地址
            "id": "com.goth.app"    // 用来表示特定平台的标识
        }
    ]                                 // 指定各平台的原生应用
}
```

也可以参考 [Web App Manifest](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)。

## 自定义询问安装提示框

略，[文档](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)有介绍。
