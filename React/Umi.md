
# Umi 使用笔记

## 介绍

[Umi](https://umijs.org/zh-CN) ，中文可发音为乌米，是可扩展的企业级前端应用框架。

Umi 以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

Umi 是蚂蚁金服的底层前端框架，已直接或间接地服务了 3000+ 应用，包括 java、node、H5 无线、离线（Hybrid）应用、纯前端 assets 应用、CMS 应用等。他已经很好地服务了我们的内部用户，同时希望他也能服务好外部用户。

为什么不是 create-react-app ？ create-react-app 是基于 webpack 的打包层方案，包含 build、dev、lint 等，他在打包层把体验做到了极致，但是不包含路由，不是框架，也不支持配置。所以，如果大家想基于他修改部分配置，或者希望在打包层之外也做技术收敛时，就会遇到困难。

## .umirc.ts

放在最前面先说， `.umirc.ts` 文件是 Umi 的核心，它可以包含整个项目的配置，详细的配置项请看 [官网](https://umijs.org/zh-CN/config) 。

## hello-world

- 确保 node 版本是 10.13 或以上。

- 推荐使用 yarn 管理 npm 依赖，并使用国内源。

  ``` shell
  # 国内源
  $ npm i yarn tyarn -g
  # 后面文档里的 yarn 换成 tyarn
  $ tyarn -v
  ```

- 创建脚手架：新建一个项目文件夹，在**目录内**运行如下命令

  ``` shell
  $ yarn create @umijs/umi-app
  # 或 npx @umijs/create-umi-app
  ```

- 安装依赖：

  ``` shell
  $ yarn
  ```

- 启动项目：

  ``` shell
  $ yarn start
  ```

## 修改配置

默认的脚手架内置了 @umijs/preset-react，包含布局、权限、国际化、dva、简易数据流等常用功能。比如想要 ant-design-pro 的布局，编辑 `.umirc.ts` 配置 `layout: {}` :

(需要先安装 `pro-layout` : `yarn add @ant-design/pro-layout`)

``` ts
import { defineConfig } from 'umi';
export default defineConfig({
  layout: {}, // 新增这行
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
```

不用重启 `yarn start` ， webpack 会在背后增量编译，过一会就可以看到新的界面。

## 部署发布

使用如下命令，可以构建产物默认生成到 `./dist` 下:

``` shell
$ yarn build
```

然后通过 `tree` 命令查看:

``` shell
tree ./dist

./dist
├── index.html
├── umi.css
└── umi.js
```

发布之前，可以通过 `serve` 做本地验证:

``` shell
$ yarn global add serve
$ serve ./dist

   ┌────────────────────────────────────────────────────┐
   │                                                    │
   │   Serving!                                         │
   │                                                    │
   │   - Local:            http://localhost:5000        │
   │   - On Your Network:  http://192.168.12.34:5000    │
   │                                                    │
   │   Copied local address to clipboard!               │
   │                                                    │
   └────────────────────────────────────────────────────┘
```

## 路由配置

### 配置式路由

Umi 默认使用**配置式路由**，具体请看 [demo](./umi_demo) 中的 `./config/routes.ts` 和 `./.umirc.ts` ，更详细的介绍请看 [官网](https://umijs.org/zh-CN/docs/routing) 。

### 约定式路由

除了配置式路由， Umi 还支持 [**约定式路由**](https://umijs.org/zh-CN/docs/convention-routing) ，就是不需要手写配置，文件系统即路由，通过目录和文件及其命名分析出路由配置。

**如果没有 routes 配置， Umi 会进入约定式路由模式**，然后分析 `src/pages` 目录拿到路由配置。

### 页面跳转

有两种方式可以实现，即**声明式**和**命令式**。

声明式：

``` js
import { Link } from 'umi';
export default () => (
  <Link to="/list">Go to list page</Link>
);
```

命令式：

``` js
import { history } from 'umi';
function goToListPage() {
  history.push('/list');
}
```

组件中的 `props` 也自动添加了 `history` 对象，用于路由跳转：

``` js
export default (props) => (
  <Button onClick={()=>props.history.push('/list');}>Go to list page</Button>
);
```

路由监听：

``` js
import { history } from 'umi';
const unlisten = history.listen((location, action) => {
  console.log(location.pathname);
});
unlisten();
```

## 请求

Umi 默认使用 [@umijs/plugin-request](https://umijs.org/zh-CN/plugins/plugin-request) 发送请求。该插件无需手动安装，直接可以使用。

请求的**模拟数据**，可以在项目根目录下的 `./mock/*.ts` 中配置。注意，在 `mock` 目录下的所有文件会自动配置，无需手动引入。

请求或响应的**拦截器**，还有请求的相关**配置**，都可以在项目根目录下的 `./app.ts` 文件中配置，如下：

``` js
import { RequestConfig } from 'umi';
export const request: RequestConfig = {
    timeout: 1000,
    errorConfig: {},
    middlewares: [],
    requestInterceptors: [],
    responseInterceptors: [],
  // ....
}
```

在组件中**发起请求**的方法，如下：

``` js
import { request } from 'umi';
// request 方法返回的是 promise
request('/api/users/create', {
  method: 'post',
  data: { id: 1 },
  params: { foo: 2 }
}).then(res => {
  console.log("test post")
  console.log(res)
})
// get 方法的请求可以直接传入 url
request('/api/users').then(res => {
  console.log(res)
});
```

更多关于 umi-request 请查看 [官方文档](https://github.com/umijs/umi-request/blob/master/README_zh-CN.md) 。

## 示例 demo

[链接](./umi_demo)。

## 其他内容请看官网介绍

https://umijs.org/zh-CN/

## 注意

- 请勿手动安装 `@umijs/*` 的依赖包，当你配置的时候，就会自动安装对应的依赖。若重复安装会导致报错。
