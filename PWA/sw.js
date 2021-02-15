const OLD_CACHE_NAME = '',
    CACHE_NAME = 'my_cache_v1.0.0';


// 在 INSTALLING 和 INSTALLED 之间触发
self.addEventListener('install', e => {
    console.log('安装中...', e);
    // waitUnit 的作用是延长事件的寿命，直到传递的 Promise 被成功地 resolve ，以确保
    // 如果 Promise 是 rejected， active worker 会被设置为 redundant
    e.waitUntil(
        new Promise((resolve, reject) => {
            // 每次都删除旧的缓存组
            caches.has(OLD_CACHE_NAME).then(has => {
                has ? caches.delete(OLD_CACHE_NAME) : null
            })
            // 打开特定的缓存组
            caches.open(CACHE_NAME).then(cache => {
                // 缓存离线页面
                return cache.add('/offline.html')
            }).then(_ => {
                resolve()
            }).catch(err => {
                console.error(err)
                reject()
            })
        })
    )
})



// 需要注意的是，当"旧的"serviceWorkders还在控制页面，"新的"serviceWorkders就会处于等待中状态
// 除非所有页面都关闭了，"新的"serviceWorkders就会进入ACTIVATING



// 在 ACTIVATING 和 ACTIVATED 之间触发
self.addEventListener('activate', e => {
    console.log('激活中...', e);
})



// 监听页面发起的请求
self.addEventListener('fetch', e => {
    // 只针对主页
    let htmlUrl = `${location.protocol}//${location.host}/`
    if (e.request.url !== htmlUrl) return false
    // 返回新请求 (缓存/新Response对象/Cache缓存的Response)
    e.respondWith(
        new Promise((resolve, reject) => {
            // 重新发送请求 (若失败了,可能是网络问题,然后之前缓存的资源)
            fetch(e.request.url).then(response => {
                resolve(response)
            }).catch(_ => {
                caches.open(CACHE_NAME).then((cache) => {
                    // 之前缓存的页面
                    return cache.match('/offline.html')
                }).then(response => {
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            })
        })
    )
})



// 监听 sync 事件
self.addEventListener('sync', e => {
    if (e.tag !== 'mySyncTagName') return
    // 虽然 waitUntil 的参数类型的promise，但一般传入用于同步的 fetch 请求 (离线时自动保存,等网络恢复立即发送)
    e.waitUntil(
        fetch('/testsync').then(res => {
            console.log('请求成功：', res)
        }).catch(err => {
            // 最后重试的机会
            if (e.lastChance) {
                /* 做点什么... */
            }
            console.error('请求失败：', err)
        })
    )
})



/**
 * 【 serviceWoker 向页面发送数据 】
 * Clients API (到2019.12为止,safari还没支持)
 * Clients 上有 get 、 matchAll 、 openWindow claim 4个方法，都是返回 promise
 * 
 * @function get(clientId)  获取特定的窗口
 *    @param {String} clientId 页面ID
 *    @returns {promise<client|undefined>} promise返回页面对象
 * 
 * @function matchAll(options?) 查询被控制的窗口
 *    @param {{includeUncontrolled,type}} options 可选参数
 *      @includeUncontrolled 布尔值，是否匹配与serviceWorker共享相同源的所有服务工作者客户端。默认为false
 *      @type 设置想要匹配的 clients 类型. 可用值包括 window, worker, sharedworker, all 。默认是 all
 *    @returns {promise<clients|[]>}
 * 
 * @function openWindow(url)  打开给定URL的新浏览器窗口 (实测无效,promise总是reject)
 *    @param  {USVString} url 表示要在窗口中打开的client的URL。通常，此值必须是与调用脚本有相同域的 URL
 *    @returns {promise<client|null>}
 * 
 * @function claim()  允许一个激活的 service worker 将自己设置为其 scope 内所有 clients 的 controller
 *    @returns {promise<void>}
 *    @注意 当一个 serviceWorker 被初始注册时，页面在下次加载之前不会使用它。此方法会立即控制这些页面
 *    @注意 这会导致 serviceWorker 控制通过网络定期加载的页面，或者可能通过不同的 service worker 加载
 *    @注意 一般用于 activate 监听器内，event.waitUntil(clients.claim())
 */

self.clients.matchAll().then(clients => {
    // ...
})



/**
 * 使用 MessageChannel (serviceWorker端)
 * 1. 页面先创建端口，并通过.postMessage()传递到serviceWorker ...
 * 2. 在message监听器的事件对象中，通过 e.ports[0] 获取端口，并保存起来
 * 3. 使用上一步获取到的端口，向页面发送消息；同时监听该端口，以获取后续接收到的消息
 */
let openPort;
self.addEventListener('message', e => {
    if (e.data !== '保持通话,得闲饮茶') return
    // 获取页面提供的"通话端口"
    openPort = e.ports[0]
    // 监听端口消息 (不能使用addEventListener)
    openPort.onmessage = _e => {
        console.log('来自 页面 的消息： ', _e.data)
        setTimeout(_ => {
            // 向页面端发送数据
            openPort.postMessage(`已收到(${_e.data})`)
        }, 3000);
    }
})



// 暂时用 message 事件触发
self.addEventListener('message', e => {
    if (e.data !== 'showNotification') return

    self.registration.showNotification('Notification Title', {
        body: '这是一条 Notification ',
        icon: '/notified_icon.png', // 在通知中显示的图标URL地址
        image: '/test.png', // 在通知中显示的图像的URL地址
        // 操作器对象数据(通知的底部的功能按钮,最多2个) (serviceWorkder内通过onnotificationclick监听事件)
        actions: [{
            action: 'action1', // 按钮名称 (相当于事件名,事件对象的action属性就是此值)
            title: 'action1', // 操作按钮的标题
            icon: '/notified_action1.png' // 操作按钮图标地址
        }, {
            action: 'action2',
            title: 'action2',
            icon: '/notified_action2.png'
        }],
        tag: '1', // 通知的唯一标识 (已有同名通知在显示,旧通知会被覆盖;否则添加新通知)
        renotify: true, // 旧消息被替换时是否更新通知 (默认false时,旧消息只会被悄然替换;当设置true时,设备会再次震动或提示音吸引用户注意新消息)
        data: [1, 22, 333], // 通知携带的数据(任意数据类型)
        dir: 'ltr', // 在通知中显示的文本方向，两个可选值："ltr"(默认)、"rtl"
        badge: '/notified_badge.png', // 徽章图片地址 (用于标识不同类型的通知)
        // lang: '', // 指定通知中使用的语言
        // vibrate: [200, 100, 300], // 接收整形数组。设置震动频率(支持震动的设备) (示例中表示震动200ms,后停顿100ms,再震动300ms,如此循环) (不支持)
        // noscreen: true, // 用来指定设备的屏幕是否会被这个通知打开 (不支持)
        // silent: false, // 用来指定通知是否静默(即没有震动或声音) (不支持)
        // sound: '/notified_sound.mp3' // 通知时播放的音效文件 (不支持)
    })

})



/* 监听 Notification 事件 */
// Notification 被关闭
self.addEventListener('notificationclose', e => {
    // ...
})
// Notification 被点击
self.addEventListener('notificationclick', e => {
    // ...
})
// Notification 的 action 按钮被点击
self.addEventListener('activate', e => {
    // ...
})



self.addEventListener("push", e => {
    // e.data 返回的是一个 respond 对象，该对象上除了 text() 方法获取文本，还有 .json() 方法把JSON字符串转成对象，具体看服务器的返回
    let msg = e.data.text()
    // 弹出通知
    self.registration.showNotification('Push message received', {
        body: msg
    })
})