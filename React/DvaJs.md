
# DvaJs

## 起步

### 简介

[dva](https://dvajs.com/) 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验， dva 还额外内置了 react-router 和 fetch ，所以也可以理解为一个轻量级的应用框架。

### 安装

``` shell
$ npm install dva-cli -g
# 确保版本是 0.9.1 或以上
$ dva -v
dva-cli version 0.9.1
```

### 创建项目

``` shell
$ dva new <program_name>
```

我在实际使用时，发现它是默认使用 `cnpm` 安装初始依赖的，所以后续安装额外的模块都需要使用 `cnpm` 。不清楚这是否与我已经安装 `cnpm` 有关。

### 使用 antd

``` shell
# babel-plugin-import 是用来按需加载 antd 的脚本和样式的
$ npm install antd babel-plugin-import --save
```

编辑 `.webpackrc` ，使 `babel-plugin-import` 插件生效。

``` json
{
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ]
}
```

注： dva-cli 基于 roadhog 实现 build 和 dev，更多 `.webpackrc` 的配置详见 [roadhog#配置](https://github.com/sorrycc/roadhog#%E9%85%8D%E7%BD%AE)

## 项目目录结构简单介绍

### 路由

在项目根目录下的 `./router.js` 用于配置路由，写法与 react-router 类似。

路由页面都默认放在 `./routes/*` 。

而对于可抽离的模块，默认放在 `./components/*` 。

### 状态管理

在项目根目录下的 `./src/models` 文件夹中，放置不同组件的 state 。

每个"状态文件"都有固定的几个属性：(具体看 `./src/models/homeState.js` )

- `namespace`: 该状态文件的作用域名称
- `state`: 存放状态值
- `effects`: 存放**异步**的方法，且必须调用 `reducers` 中的方法修改状态
- `subscriptions`: 存放**订阅**的方法，同样依赖 `reducers` 中的方法修改状态
- `reducers`: 存放**同步**的方法

然后在 `./src/index.js` 中，使用 `app.model()` 方法配置状态管理模块，如下：

``` js
app.model(require('./models/homeState').default);
app.model(require('./models/todoListState').default);
```

在组件中，可以通过 `connect()` 方法，把组件与状态管理"连接"起来，如下：

``` js
// 与 Redux 的 connect 相同
export default connect(({ homeState: { random } }) => ({ random }))(Home);
```

使用 `connect` 方法"连接"后，组件的 `props` 会注册指定的 `state` 和 `dispatch` ，如下：

``` js
function Home({ dispatch, random }) {
  // ...
  function asyncUpdateRandom() {
    // dispatch 方法需要针对 特定的作用域 的 特定的方法 发起
    dispatch({ type: "homeState/asyncUpdateRandom", random: Math.random() });
  }
}
```

### 页面及组件

页面文件统一放在 `./src/routes` 目录下。

组件文件统一放在 `./src/components` 目录下。
