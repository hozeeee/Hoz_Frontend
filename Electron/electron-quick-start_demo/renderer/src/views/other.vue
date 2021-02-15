<template>
  <div>
    <h2>主进程的其他模块</h2>
    <strong>主模块的其他模块就不过多介绍了，下面简单列出模块名及对应的功能：</strong>
    <ul style="text-align:left;">
      <li>"powerSaveBlocker"： 用于阻止系统进入低功耗 (休眠) 模式。</li>
      <li>"powerMonitor"： 用于监视电源状态的改变。提供了事件和方法。</li>
      <li>"protocol"：用于注册自定义协议并拦截基于现有协议的请求。</li>
      <li>"screen"：用于检索有关屏幕大小、显示器、光标位置等的信息。提供了事件和方法。</li>
      <li>"session"：用于管理浏览器会话、cookie、缓存、代理设置等。提供了事件和方法。</li>
      <li>"Notification"：创建OS(操作系统)桌面通知。（本质就是 HTML5 Notification ）</li>
      <li>"systemPreferences"：获取 system preferences 。提供了事件和方法。</li>
      <li>"net"：使用 Chromium 的原生网络库发出 HTTP / HTTPS 请求。</li>
      <li>"netLog"：用于记录网络会话的事件。</li>
      <li>"globalShortcut"：用于注册系统快捷键(即使应用没有获得键盘焦点)。</li>
      <li>"contentTracing"：收集来自 Chromium 的跟踪数据，以发现性能瓶颈和缓慢的操作。</li>
      <li>"inAppPurchase"：Mac App Store 中的应用内购买。</li>
      <li>"TouchBar"：为原生 macOS 应用创建 TouchBar 布局。</li>
      <li>"autoUpdater"：使应用程序能够自动更新。提供了事件和方法。</li>
    </ul>
  </div>
</template>