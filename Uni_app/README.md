
# uni-app

[**uni-app**](https://uniapp.dcloud.io/) 是一个使用 `Vue.js` 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS 、 Android 、 H5 、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉）等多个平台。

uni-app 框架：

![uni-app框架](./图片/uni-app框架.png)

它使用 `Vue@2.x` 的语法，如果已经熟悉 Vue ，则学习成本不大。

但并不意味着不用学习，有几点需要注意的：

- **组件标签**靠近小程序规范。意味着不能用 h5 的标签，例如 `<view>` 替代 `<div>` 。详见 [uni-app 组件规范](https://uniapp.dcloud.io/component/README) 。
- **接口能力**（JS API）靠近微信小程序规范，但需将前缀 `wx` 替换为 `uni` 。详见 [uni-app 接口规范](https://uniapp.dcloud.io/api/README) 。
- App及页面的**生命周期**，是在 `Vue.js` 的基础上作出了补充。

总的来说，就是 `Vue.js` + 微信小程序 的结合体。

如果要兼容多端，可能要了解 `Vue.js` 在不同平台之间的差异，查看 [**Vue 特性支持表**](https://uniapp.dcloud.io/use?id=vue%e7%89%b9%e6%80%a7%e6%94%af%e6%8c%81%e8%a1%a8) 了解。

uni-app 在 App 端内置了一个基于 [**weex**](https://weex.apache.org/) 改进的原生渲染引擎，提供了原生渲染能力。

在 App 端，如果使用 vue 页面，则使用 webview 渲染；如果使用 **nvue** 页面(native vue 的缩写)，则使用原生渲染。一个 App 中可以同时使用两种页面，比如首页使用 nvue ，二级页使用 vue 页面， hello uni-app 示例就是如此。

虽然 nvue 也可以多端编译，输出 H5 和小程序，但 nvue 的 css 写法受限，所以如果你不开发 App ，那么不需要使用 nvue 。 [关于使用 Weex/nvue 注意事项](https://uniapp.dcloud.io/use-weex) 。
[跨端开发的注意事项](https://uniapp.dcloud.io/matter) ，这是官方整理的一些"坑"，遇到不能奇怪的问题可以查阅。

[性能优化建议](https://uniapp.dcloud.io/performance) 。

uni-app 还提供了 [插件市场](https://ext.dcloud.net.cn/) ，包括 前端组件、js sdk、页面模板、项目模板、原生插件 等多种类型。

</br>

## 组件

uni-app 为开发者提供了一系列**基础组件**，类似 HTML 里的基础标签元素。

但 **uni-app 的组件与 HTML 不同**，而是与小程序相同，更适合手机端使用。

uni-app 提供的基础组件，请 [查阅官网](https://uniapp.dcloud.io/component/README) 。

</br>

## API

uni-app 的 API 都放在全局对象 **`uni`** 中。

**`uni`** 提供的 API ，请 [查阅官网](https://uniapp.dcloud.io/api/README) 。

## uniCloud

TODO: https://uniapp.dcloud.io/uniCloud/README

serverless

</br>

## HBuilderX

官方 IDE 开发工具 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 。

[HBuilderX](https://www.dcloud.io/hbuilderx.html) 是通用的前端开发工具，但为 uni-app 做了特别强化。 HBuilderX 是一个 IDE 而非编辑器，打包特定的项目时会自动注入依赖。

使用 HBuilderX 创建 uni-app ：

1. 在点击工具栏里的文件 -> 新建 -> 项目
2. 选择 uni-app ，输入工程名，如：hello-uniapp，点击创建，即可成功创建 uni-app 。点击模板里的 Hello uni-app 即可体验官方示例。

</br>

## 目录结构

``` txt
my-uni-app
├─ cloudfunctions        云函数目录（阿里云为aliyun，腾讯云为tcb）  详见 uniCloud
├─ components            符合 vue 组件规范的 uni-app 组件目录
│   └─ comp.vue
├─ hybrid                存放本地网页的目录                        详见 web-view
├─ platforms             存放各平台专用页面的目录                   详见 platforms-page
├─ pages                 业务页面文件存放的目录
│   ├─ index
│   │   └─ index.vue     index 页面
│   └─ list
│       └─ list.vue      list 页面
├─ static                存放应用引用静态资源（如图片、视频等）的目录
├─ wxcomponents          存放小程序组件的目录                      详见 小程序组件支持
├─ main.js               入口文件
├─ App.vue               应用配置，用来配置 App 全局样式以及监听
├─ manifest.json         配置应用名称、appid、logo、版本等打包信息
└─ pages.json            配置页面路由、导航条、选项卡等页面类信息
```

扩展阅读：

- [uniCloud](https://uniapp.dcloud.io/uniCloud/)
- [web-view](https://uniapp.dcloud.io/component/web-view)
- [platforms-page](https://uniapp.dcloud.io/platform?id=%E6%95%B4%E4%BD%93%E7%9B%AE%E5%BD%95%E6%9D%A1%E4%BB%B6%E7%BC%96%E8%AF%91)
- [小程序组件支持](https://uniapp.dcloud.io/frame?id=%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%BB%84%E4%BB%B6%E6%94%AF%E6%8C%81)
- [manifest.json](https://uniapp.dcloud.io/collocation/manifest)
- [pages.json](https://uniapp.dcloud.io/collocation/pages)

`manifest.json` 和 `pages.json` 配置文件建议用 HBuilderX 打开，因为 HBuilderX 提供了可视化的界面，配置起来很方便。

关于文件**资源**及**引用**的一些问题：

- 与普通的 `Vue.js` 开发类似， **`static`** 存放**不被编译**的静态文件。
- 能使用 `@` 表示项目根目录。但旧版本不支持此方式。
- 在 H5 平台，小于 4kb 的资源会被转换成 base64 ，其他情况不转。
- 支付宝小程序组件内 image 标签不可使用相对路径。
- 在 "css" 代码中引入外部资源，使用 `@import url('....');` 。
- 本地背景图片的引用路径推荐使用以 `~@` 开头的绝对路径，如 `background-image: url('~@/static/logo.png');` 。

更多项目文件的介绍，请 [查看官网](https://uniapp.dcloud.io/collocation/pages) 。

</br>

## 生命周期

声明周期分为两部分，[**应用生命周期**](https://uniapp.dcloud.io/frame?id=%e5%ba%94%e7%94%a8%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)和[**页面生命周期**](https://uniapp.dcloud.io/frame?id=%e9%a1%b5%e9%9d%a2%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)。

需要注意的是:

- "应用生命周期仅可在 `App.vue` 中监听，在其它页面监听无效。
- "页面生命周期" 有很多，不多介绍了，某些函数仅针对某些平台。

其他就不多介绍了，需要用到的时候在查阅 [官网文档](https://uniapp.dcloud.io/frame?id=%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f) 吧。

</br>

## 路由

uni-app 页面路由为框架统一管理，开发者需要在 `pages.json` 里配置每个路由页面的路径及页面样式。类似小程序在 `app.json` 中配置页面路由一样。

所以 uni-app 的路由用法**与 Vue Router 不同**，如仍希望采用 Vue Router 方式管理路由，可在插件市场搜索 Vue-Router 。

路由跳转有两种方式：

- 声明式：

  ``` xml
  <!-- 声明式路由 -->
  <navigator url="/pages/myPage1/myPage1" open-type="navigate">
    <button type="default">声明式路由-跳到myPage1</button>
  </navigator>
  ```

  [更多关于 navigator](https://uniapp.dcloud.io/component/navigator) 。

- 函数式：

  ``` js
  uni.navigateTo({
    url: "/pages/myPage1/myPage1"
  })
  ```

  [更多关于路由 API](https://uniapp.dcloud.io/api/router) 。

除了 `navigateTo` 打开新页面，还有：

- `uni.redirectTo` 和 `<navigator open-type="redirectTo"` ，页面重定向当前页面出栈，新页面入栈。
- `uni.navigateBack` 和 `<navigator open-type="navigateBack"` ，页面返回，页面不断出栈，直到目标返回页。
- `uni.switchTab` 和 `<navigator open-type="switchTab"` ， Tab 切换，页面全部出栈，只留下新的 Tab 页面。
- `uni.reLaunch` 和 `<navigator open-type="reLaunch"` ，重加载，页面全部出栈，只留下新的页面。

</br>

## 运行环境&平台的判断

### 运行环境

通过全局变量 **`process.env.NODE_ENV`** 可以获取当前的运行环境。

当处于测试环境，该变量的值为 `development` ；当处于生产环境，该变量的值为 `production` 。

如果你需要**自定义**更多环境，例如测试环境：

- 假设只需要对单一平台配置，可以 [`package.json`](https://uniapp.dcloud.io/collocation/package) 中配置。
- 如果是针对所有平台配置，可以在 [`vue-config.js`](https://uniapp.dcloud.io/collocation/vue-config) 中配置。

### 平台

平台判断有 2 种场景，一种是在**编译期**判断，一种是在**运行期**判断。

判断平台的作用是，针对不同平台，使用不同的代码。

- 编译期判断，也被称为 [**条件编译**](https://uniapp.dcloud.io/platform) ，针对不同平台，使用不同的代码。

  ``` js
  // #ifdef H5
    alert("只有h5平台才有alert方法")
  // #endif
  ```

  可以看出，都是在注释中编写，以 `#ifdef <平台>` 表示开始，以 `#endif` 表示结束判断。

  它可以用于 `.vue`、`.js`、`.css`、`pages.json`、各预编译语言文件(如：`.scss`, `.less`, `.stylus`, `.ts`, `.pug`) 。

  [更多关于 条件编译](https://uniapp.dcloud.io/platform) 。

- 运行期判断，是指代码已经打入包中，仍然需要在运行期判断平台，此时可使用 uni.getSystemInfoSync().platform 判断客户端环境是 Android、iOS 还是小程序开发工具（在百度小程序开发工具、微信小程序开发工具、支付宝小程序开发工具中使用 uni.getSystemInfoSync().platform 返回值均为 devtools）。

  ``` js
  let platform = uni.getSystemInfoSync().platform;
  // 可能的值： android ios ...
  console.log(platform);
  ```

  注意，在百度小程序开发工具、微信小程序开发工具、支付宝小程序开发工具中使用 `uni.getSystemInfoSync().platform` 返回值均为 `devtools` 。

  其实也可以在"条件编译"定义全局变量，然后在运行时获取变量值。

</br>

## 样式

### CSS单位

uni-app 支持的通用 css 单位包括 `px` `、rpx` ：

- `px` 即屏幕像素
- `rpx` 即响应式 `px` ，一种根据屏幕宽度自适应的动态单位。**以 750 宽的屏幕为基准**，`750rpx` 恰好为屏幕宽度。屏幕变宽， `rpx` 实际显示效果会等比放大。

vue 页面支持普通 H5 单位，但在 nvue 里不支持：

- `rem`: 默认根字体大小为 屏幕宽度/20 （微信小程序、字节跳动小程序、App、H5）
- `vh`: viewpoint height ，视窗高度， `1vh` 等于视窗高度的 `1%`
- `vw`: viewpoint width ，视窗宽度， `1vw` 等于视窗宽度的 `1%`
- nvue 还不支持百分比单位。

更多细节请查阅 [官网文档](https://uniapp.dcloud.io/frame?id=%e5%b0%ba%e5%af%b8%e5%8d%95%e4%bd%8d) 。

### CSS变量

uni-app 提供了几个内置 CSS 变量：

| CSS变量               | 描述                   | App                          | 小程序 | H5                   |
|-----------------------|------------------------|------------------------------|--------|----------------------|
| `--status-bar-height` | 系统状态栏高度         | 系统状态栏高度、nvue注意见下 | 25px   | 0                    |
| `--window-top`        | 内容区域距离顶部的距离 | 0                            | 0      | NavigationBar 的高度 |
| `--window-bottom`     | 内容区域距离底部的距离 | 0                            | 0      | TabBar 的高度        |

使用示例：

``` html
<style>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
</style>
```
