
# 简介

[Babel](https://www.babeljs.cn/) 是一个 JavaScript 编译器。

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为**向后兼容**的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

Babel 还为各大编辑器提供了语法高亮的插件，[链接](https://www.babeljs.cn/docs/editors)。

</br>

# 起步

1. 安装基本的依赖：

    ``` shell
    npm install @babel/core @babel/cli @babel/preset-env -D
    ```

2. 创建配置文件。[参考下面](#配置文件)。

3. 命令行执行：

    ``` shell
    ./node_modules/.bin/babel src --out-dir lib
    ```

## `@babel/core` 和 `@babel/cli`

核心功能都在 `@babel/core` ，我们还可以直接在 JS 程序中使用它。如下：

``` js
const babel = require("@babel/core");
babel.transform("code", optionsObject);
```

`@babel/cli` 则是使我们能在命令行中使用 babel 工具，前提是必须同时安装了 `@babel/core`。

``` shell
./node_modules/.bin/babel src --out-dir lib
```

</br>

# 创建配置文件

若需要编译 `node_modules` 目录下的模块，请使用 `babel.config.js`；若只需要编译本项目的文件，请使用 `.babelrc` 。

## babel.config.js

``` js (babel.config.js)
module.exports = function (api) {
  api.cache(true);
  const presets = [ ... ];
  const plugins = [ ... ];
  return {
    presets,
    plugins
  };
}
```

## .babelrc

``` json (.babelrc)
{
  "presets": [...],
  "plugins": [...]
}
```

还可以使用 `.babelrc.js` ，以 JS 抛出模块的方式书写。

``` js (.babelrc.js)
const presets = [ ... ];
const plugins = [ ... ];
module.exports = { presets, plugins };
```

同样的配置，可以在 `package.json` 中的 `"babel"` 属性中配置。

``` json (package.json)
{
  ...
  "babel": {
    "presets": [ ... ],
    "plugins": [ ... ],
  }
}
```

</br>

# 插件(plugins)

如果想要 Babel 做一些实际的工作，就需要为其添加插件。如解析和转换代码。 [官方网站](https://www.babeljs.cn/docs/plugins) 列出了大量插件，请自行查阅。

## 简写约定

插件的包名称都是以 `@babel/plugin-transform-*` 开头。配置里可以省略 `babel-plugin-` 。例子如下：

``` json
{
  "plugins": [
    "myPlugin", // 等效于 "babel-plugin-myPlugin"
    "@org/name" // 等效于 "@org/babel-plugin-name"
  ]
}
```

## 执行顺序

插件是有执行顺序的，是"**从前往后**"，如下面例子，是先执行 `transform-decorators-legacy` 后执行 `transform-class-properties` 。

``` json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```

## 参数

参数由**插件名**和**参数对象**组成一个数组。例子如下：

``` json
{
  "plugins": [
    [
      "transform-async-to-module-method",
      {
        "module": "bluebird",
        "method": "coroutine"
      }
    ]
  ]
}
```

## 创建自己的插件

略。请看 [官方介绍](https://github.com/jamiebuilds/babel-handbook) 。

</br>

# 预设(preset)

`preset` 可以作为 Babel 插件的组合，甚至可以作为可以共享的 [`options`](#其他配置项) 配置。

preset 也是有执行顺序的，是"**从后往前**"。和 plugins 刚好相反。

preset 的参数与 plugins 一致。

简写约定的例子：(配置里可以省略 `babel-preset-` 。)

``` json
{
  "presets": [
    "myPreset", // 等效于 "babel-preset-myPreset"
    "@org/name" // 等效于 "@org/babel-preset-name"
  ]
}
```

从 Babel v7 开始，所有针对处于标准提案阶段的功能所编写的预设（stage preset）都已被弃用。这里不多介绍。即 `@babel/preset-stage-*` 都不建议使用。

官方的 Preset ：

- [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)
- [@babel/preset-flow](https://www.babeljs.cn/docs/babel-preset-flow)
- [@babel/preset-react](https://www.babeljs.cn/docs/babel-preset-react)
- [@babel/preset-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)

vue 也有对应的 preset ：`@vue/cli-plugin-babel/preset` 。

下面只介绍 `@babel/preset-env` ，其他可以自行到官网查阅。

## @babel/preset-env

安装 `npm install @babel/preset-env -S`

对基于 浏览器 或 Electron 的项目，建议使用 [`.browserslistrc`](https://github.com/browserslist/browserslist) 指定目标(`package.json`中也能配置)。

下面介绍该预设的可选参数：

``` json
{
  "presets": [
    [
      "@babel/preset-env",  // 等效于 "@babel/env"
      {
        // 指定项目的目标环境 (必须指定,不然就没意义了)
        // 可以使用"browserslist"的语法
        // "targets": "> 0.25%, not dead"
        // 指定多个浏览器的版本号
        "targets": {
          // chrome, opera, edge, firefox, safari, ie, ios, android, node, electron
          "edge": "14",
          "firefox": "47",
          "chrome": "56",
          "safari": "9",
          // 定位为支持ES模块的浏览器 (指定时,上面的浏览器目标将被忽略) (即可以使用"<script type="module"></script>"的浏览器)
          // "esmodules": true
          // 也可以针对特定版本的node.js进行编译 (可选值:string|"current"|true,后两者效果相同)
          // "node": true
        },

        // 配置如何处理polyfills。可选值："usage","entry",false(默认)。
        // 设为"usage"，自动为每个文件"按需"引入 polyfills
        // 设为"entry"，引入所有 polyfills (需要手动,如在 webpack 配置的 "entry" 配置,或入口js文件下引入)
        "useBuiltIns": "usage",

        // 指定"core-js"的版本。可选值：2(默认),3,false。 (仅当"useBuiltIns"不为false时才有效) (还需安装对应的"core-js")
        "corejs": 3,

        // 是否使用更符合规范要求的的插件。布尔值，默认false。
        "spec": false,

        // 是否使用"宽松模式"。布尔值，默认false。(资料: https://2ality.com/2015/12/babel6-loose-mode.html)
        "loose": false,

        // 引入模块的标准。可选值： "amd","umd","systemjs","commonjs"/"cjs","auto",false,"auto"(默认) 。
        "modules": "auto",

        // 是否在"console.log"打印出使用的工具。布尔值，默认false。
        "debug": true,

        // 额外包含的babel插件。字符串数组，默认[]。
        "include": [],

        // 需要排除的babel插件。字符串数组，默认[]。
        "exclude": [],

        // 是否忽略"browserslist"。布尔值，默认false。
        "ignoreBrowserslistConfig": false,

        // 强制转换所有。布尔值，默认false。
        "forceAllTransforms": false,

        // 配置搜索browserslist的起点。字符串，默认当前目录(`process.cwd()`)。
        "configPath": "./",

        // 切换对浏览器提供的内置/特性建议的支持。布尔值，默认false。
        "shippedProposals": false
      }
    ]
  ]
}
```

</br>

# 其他配置项

大部分的配置项在普通的开发中可能并用不上，具体请查阅 [官网介绍](https://www.babeljs.cn/docs/options) 。

</br>

# polyfill

在 Babel7.4 之后，不推荐使用 `@babel/polyfill` 。推荐使用的是 [`core-js`](https://github.com/zloirock/core-js) 和 [`regenerator-runtime`](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) 。如下：

``` js
// 入口文件
import "core-js/stable";
import "regenerator-runtime/runtime";
// ...
```

在 Babel 配置文件(如`.babelrc`)的 `corejs` 属性可以指定 `core-js` 的版本(建议使用3)。

若 Babel 配置文件中设置了 `"useBuiltIns": "usage"` ， Babel 会自动为每个 js 文件添加需要的 polyfill 。

</br>

# 工具

- [@babel/parser](https://www.babeljs.cn/docs/babel-parser): 是 js 解析器，生成 [Babel AST](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md) 格式的对象，是基于 [ESTree spec](https://github.com/estree/estree) (两者差异请查阅官网介绍)。
- [@babel/core](https://www.babeljs.cn/docs/babel-core): 使用当前目录的配置文件解析和转换代码。
- [@babel/generator](https://www.babeljs.cn/docs/babel-generator): 把 Babel AST 生成 js 代码。
- [@babel/code-frame](https://www.babeljs.cn/docs/babel-code-frame): 突出显示你要指定的"错误代码"的部分代码，一般用于输出控制台错误代码的位置。
- [@babel/helpers](https://www.babeljs.cn/docs/babel-helpers): 提供了一些内置的函数实现，主要用于 babel 插件的开发。
- [@babel/runtime](https://www.babeljs.cn/docs/babel-runtime): 为 babel 编译时提供一些基础工具库，作用于 `transformer[s]` 阶段。`@babel/plugin-transform-runtime` 依赖此工具。
- [@babel/template](https://www.babeljs.cn/docs/babel-template): 主要用途是为 parser 提供模板引擎，更快速的转化成 AST 。
- [@babel/traverse](https://www.babeljs.cn/docs/babel-traverse): 主要用途是来便利 AST 树，也就是在 `@babel/generator` 过程中生效。
- [@babel/types](https://www.babeljs.cn/docs/babel-types): 主要用途是在创建 AST 的过程中判断各种语法的类型。

</br>

# 与 webpack 的配合

首先需要安装 `babel-loader` ，然后在 `webpack.config.js` 中配置，其他的也上面介绍的一致。具体查看 [webpack 官网](https://webpack.docschina.org/loaders/babel-loader/) 的介绍，或者看 [demo](#babel_webpack_demo) 的配置。

</br>

</br>

</br>

</br>

</br>

</br>
