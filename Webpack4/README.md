
# 简介

[webpack](https://webpack.docschina.org/) 是目前最热门的前端打包工具。其具有丰富的社区生态、配置灵活、插件化扩展、官方迭代速度快等优势。

项目根目录下运行 `npm i webpack webpack-cli -D` 安装。

通过 `./node_modules/.bin/webpack -v` 可以查看当前项目安装的 `webpack` 版本。

一般情况下，在项目跟目录下创建 `webpack.config.js` 配置文件。也可以根据环境不同(如生产/开发/测试)，创建多个配置文件，统一放在 `build` 文件夹下。

以"单配置文件"为例，项目根目录下运行 `./node_modules/.bin/webpack --config webpack.config.js` 指定配置文件执行 `webpack` 打包。

</br>
</br>

# webpack.config.js

这里具体说说配置文件里面的内容。下面展示最简单的配置。

``` js
const path = require('path');
// 抛出配置文件
module.exports = {
  // 指定入口
  entry: './src/index.js',
  // 指定出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // 指定模式
  mode: 'production'
}
```

</br>

## entry(入口)

入口可以是单入口；也可以是多入口。

若 `entry` 是**字符串**，则是 **"单入口"**。

``` js
module.exports = {
  entry: "app.js"
}
```

若 `entry` 是**对象**，则是 **"多入口"**。

``` js
module.exports = {
  ...
  entry: {
    page1: "app1.js",
    page2: "app2.js",
    ...
  }
}
```

除此之外， `entry` 还可以是一个返回字符串或对象的**函数**。

</br>

## output(出口)

`output` 包括了一组选项，指示 `webpack` 如何去输出、以及在哪里输出你的「`bundle`、`asset` 和其他你所打包或使用 `webpack` 载入的任何内容」。下面展示部分选项。

``` js
module.exports = {
  ...
  output: {
    // 多入口文件时，必须使用占位符"[name]"
    filename: '[name].js',
    // 输出路径
    path: 'dist/'
  }
}
```

常用的占位符有：

|    占位符     |                               含义                                |
|:-------------:|:-----------------------------------------------------------------:|
|    [hash]     |     和整个项目的构建相关，只要项目文件有修改，此值就发生变化      |
|  [chunkhash]  | 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash |
| [contenthash] |         和文件内容有关，文件内容不变，则 contenthash 不变         |
|    [name]     |                             模块名称                              |
|     [id]      |                   模块标识符(module identifier)                   |
|    [query]    |             模块的 query，例如，文件名 ? 后面的字符串             |
|               |                                                                   |

需要说明的识， `[hash:8]` 表示只要哈希值的前 8 位。

`output.filename` 除了上面所说，还可以是一个返回字符串的函数，如 `function(e){return 'main.js'}` ，其中 `e` 包含入口文件的具体信息。

除了必要的 `output.path` 和 `output.filename` ，`output` 还有其他属性，具体查阅[官网]('https://webpack.docschina.org/configuration/output/')。

</br>

## loaders(装载器/解析器)

`loaders` 能帮助我们解析非 `js` 文件。

``` js
module.exports = {
  ...
  module: {
    // 对于某些文件忽略"规则"，不使用loader
    noParse: /jquery|lodash/,
    // 在规则中指定"哪些文件"使用"什么规则"
    rules: [
      // 例如 .txt 文件则用 raw-loader 加载解析
      { test: /\.txt/, use: 'raw-loader' },
      // 可以使用多个 loader 加载解析同一个文件
      // 注意多个 loader 是按顺序执行的，按照"从后往前"。
      // 如下面的例子中，先使用 css-loader 再使用 style-loader
      { test: /\.txt/, use: ['style-loader', 'css-loader'] }
    ]
  }
}
```

`rules[*]` 除了上面的格式外，还支持其他属性，以满足不同的文件匹配机制，具体查阅[官网](https://webpack.docschina.org/configuration/module/#rule)。

[点击查看](https://webpack.docschina.org/loaders/)官方推荐的 loader。

部分常用 loader 请看[下面](#常用loader)。

</br>

## plugins(插件)

用于 `bundle` 文件的优化，资源管理和环境变量的注入。作用于整个构建过程。对应在 `webpack.config.js` 文件内的是 `plugins` 。 `plugins` 是一个数组。

[点击查看](https://webpack.docschina.org/plugins/)官方推荐的插件。

部分常用插件请看[下面](#常用plugin)。

</br>

## mode(模式)

用来指定当前构建环境的模式，包括： `production`(生产,默认)； `development`(开发)； `none`(无)。默认值是 `production` 。

| 选项        | 默认开启的 `plugins`        |
|:------------|:----------------------------|
| development | `NameChunksPlugin`          |
|             | `NameModulesPlugin`         |
| production  | `FlagDependencyUsagePlugin` |
|             | `FlagIncludedChunksPlugin`  |
|             | `ModuleConcatenationPlugin` |
|             | `NoEmitOnErrorsPlugin`      |
|             | `OccurrenceOrderPlugin`     |
|             | `SideEffectsFlagPlugin`     |
|             | `TerserPlugin`              |
|             |                             |

在 `mode: "production"` 下会默认开启的：

- **tree shaking** (摇树优化)，即引用但未被使用的模块将不会被打包进项目。但要注意，必须是 ES6 语法引入的模块，commonjs 不支持。
- **scope hoisting** (作用域提升)，解决模块之间循环引用的问题。同样只支持 ES6 语法引入的模块，commonjs 不支持。(webpack3需要开启则需要使用`webpack.optimize.ModuleConcatenationPlugin`插件)

</br>

## devtool(开发工具)

此选项控制是否生成，以及如何生成 `source map`。`source map` 就是一个信息文件，里面储存着位置信息。有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。但要注意，只在开发环境下使用它。

``` js
module.exports = {
  ...
  devtool: 'source-map'
}
```

`devtool` 可选的字符串值如下：

|            devtool             | 构建速度 | 重新构建速度 | 适合生产环境? |     品质(quality)      |
|:------------------------------:|:--------:|:------------:|:-------------:|:----------------------:|
|             (none)             |   +++    |     +++      |      yes      |      打包后的代码      |
|              eval              |   +++    |     +++      |      no       |      生成后的代码      |
|     cheap-eval-source-map      |    +     |      ++      |      no       | 转换过的代码（仅限行） |
|  cheap-module-eval-source-map  |    o     |      ++      |      no       |  原始源代码（仅限行）  |
|        eval-source-map         |    --    |      +       |      no       |       原始源代码       |
|        cheap-source-map        |    +     |      o       |      yes      | 转换过的代码（仅限行） |
|    cheap-module-source-map     |    o     |      -       |      yes      |  原始源代码（仅限行）  |
|    inline-cheap-source-map     |    +     |      o       |      no       | 转换过的代码（仅限行） |
| inline-cheap-module-source-map |    o     |      -       |      no       |  原始源代码（仅限行）  |
|           source-map           |    --    |      --      |      yes      |       原始源代码       |
|       inline-source-map        |    --    |      --      |      no       |       原始源代码       |
|       hidden-source-map        |    --    |      --      |      yes      |       原始源代码       |
|      nosources-source-map      |    --    |      --      |      yes      |      无源代码内容      |
> +++ 非常快速, ++ 快速, + 比较快, o 中等, - 比较慢, -- 慢

上表有这样的一个规律，多个关键字的组合：

- `eval`： 使用 `eval` 包裹模块代码
- `cheap`： 不包含列信息
- `source map`:  产生 `.map` 文件
- `inline`： 将`.map`作为 `DataURI` 嵌入，不单独生成 `.map` 文件
- `module`： 包含 `loader` 的 `sourcemap`

需要注意一点：你可以直接使用 `SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin` 来替代使用 `devtool` 选项，因为它有更多的选项。切勿同时使用 `devtool` 选项和 `SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin` 插件。`devtool` 选项在内部添加过这些插件，所以你最终将应用两次插件。

</br>

## resolve(解析)

`resolve` 用于引入模块时提供的**快捷路径**。如，我们经常需要引入 `src` 目录下的文件，使用绝对路径会显得很冗长，用相对路径在移动文件时又会带来不便。常用的属性有：`resolve.alias` 、 `resolve.extensions` 、 `resolve.mainFiles` 。

``` js
const path = require('path');
module.exports = {
  ...
  resolve: {
    // 设置某个目录的别名，如，使用 `@` 代替 `*/src` 。
    alias: { '@': path.resolve(__dirname, 'src') },
    // 设置可省略的扩展名，如 `./index.js` 可以写成 `./index`。
    extensions: ['.js', '.json'],
    // 解析目录时要使用的(多个)文件别名，如 `./router/index.js` 可以简写成 `./router`
    mainFiles: ['index']
  }
}

// index.js
import { fn } from '@/utils.js';    // 等效于 '/src/utils.js'
import { fn2 } from '@/utils2';   // 等效于 '@/utils2.js'
import { fn3 } from '@/router';   // 等效于 '@router/index.js'
```

`resolve` 的更多属性，请查阅[官网](https://webpack.docschina.org/configuration/resolve/)。

</br>

## devServer(开发中)

此配置针对 **`webpack-dev-server`** 工具，所以需要安装该工具。

除了安装，还需要配置快捷命令，在 `package.json` 的 `scripts` 添加一向： `"dev": "webpack-dev-server --config webpack.config.js --hot"`。

下面是常用配置：

``` js
module.exports = {
  ...
  devServer: {
    // 主机名，当你有多个网卡的时候，可以指定特定ip
    host: '0.0.0.0',
    // 被作为索引文件的文件名
    index: 'index.html',
    // 代理，表示根路径下的 api 路径开头会被转发到指定地址。除此还有其他写法
    proxy: {
      '^/api': 'http://localhost:3000'
    },
    // 挂载的端口号
    port: 8080,
    // 启用热更新
    hot: true
  }
};
```

> 注意，必须有 `webpack.HotModuleReplacementPlugin` 才能完全启用 `HMR`。如果 `webpack` 或 `webpack-dev-server` 是通过 `--hot` 选项启动的，那么这个插件会被自动添加，所以你可能不需要把它添加到 `webpack.config.js` 中。

</br>

## stats(统计信息)

`stats` 用于设置打包时，在控制台输出的内容。

> 对于 webpack-dev-server，这个属性要放在 devServer 对象里。

`stats` 值为字符串时，webpack 提供了一些快捷属性。配置如下：

``` js
module.exports = {
  ...
  // 只在发生错误时输出
  stats: 'errors-only'
};
```

可选的字符串值如下：

|    Preset     | Alternative |          Description           |
|:-------------:|:-----------:|:------------------------------:|
| "errors-only" |    none     |       只在发生错误时输出       |
|   "minimal"   |    none     | 只在发生错误或有新的编译时输出 |
|    "none"     |    false    |            没有输出            |
|   "normal"    |    true     |            标准输出            |
|   "verbose"   |    none     |            全部输出            |
|               |             |                                |

`stats` 值还可以是对象，提供更精细的控制，详细看[官网](https://webpack.docschina.org/configuration/stats/#stats)介绍。

</br>

## target(构建目标)

`target` 表明项目的生产环境是什么，是一个字符串值。可选值如下：

| 选项              | 描述                                                                                              |
|:------------------|:--------------------------------------------------------------------------------------------------|
| async-node        | 编译为类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）                                           |
| electron-main     | 编译为 Electron 主进程。                                                                          |
| electron-renderer | 编译为 Electron 渲染进程，使用 JsonpTemplatePlugin, FunctionModulePlugin 来为浏览器环境提供目标， |
|                   | 使用 NodeTargetPlugin 和 ExternalsPlugin 为 CommonJS 和 Electron 内置模块提供目标。               |
| node              | 编译为类 Node.js 环境可用（使用 Node.js require 加载 chunk）                                      |
| node-webkit       | 编译为 Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块和 nw.gui 导入（实验性质）    |
| web               | 编译为类浏览器环境里可用（默认）                                                                  |
| webworker         | 编译成一个 WebWorker                                                                              |
|                   |                                                                                                   |

</br>

## optimization(优化)

从 webpack4 开始，会根据你选择的 mode 来执行不同的优化，不过所有的优化还是可以手动配置和重写。下面简单介绍 `optimization.splitChunks` 。

对于多个页面之间引用相同的资源，如基础库 `vue` 、 `react` 等，可以通过**公共资源的分离**，避免多个页面都打包进相同内容，以减少生产代码大小。具体请看[官方介绍](https://webpack.docschina.org/plugins/split-chunks-plugin/)。

``` js
module.exports = {
  ...
  optimization: {
    splitChunks: {
      /**
       * chunks 参数说明：
       * async 异步引入的库进行分离(默认)
       * initial 同步引入的库进行分离
       * all 所有引入的库机型分离(推荐)
       */
      chunks: 'async',
      // 被打包的文件大小,单位:字节 (即范围外的文件不被分离打包)
      minSize: 30000,
      maxSize: 0,
      // 最小引用次数 (即文件被引用的次数小于该数值,不被分离打包)
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      // 用于添加到 HtmlWebpackPlugin 插件配置的 chunks 数组中
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        commons: {
          test: / /,
          name: '',
          chunks: 'all'
        }
      }
    }
  }
}
```

</br>

## watch,watchOptions(文件监听)

文件监听是指，在发现源码发生变化时，**自动重新构建**出新的输出文件。

使用文件监听有两种方式：

- 启动 `webpack` 命令时，带上 `--watch` 参数，即 `webpack -–watch`；
- 在配置 `webpack.config.js` 中设置 `watch: true`。

文件监听的缺点是**需要刷新浏览器**才能看到效果。

文件监听的**原理**是，通过轮询判断文件的最后编辑时间是否变化，从而判断是否重新打包。

轮询的频率是可以设置的，看如下代码：

``` js
module.exports = {
  ...
  // 默认 false，也就是不开启
  watch: true,
  // 只有开启监听模式时， watchOptions 才生效
  watchOptions: {
    // 默认为空，指定不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后会等 300ms 再执行，默认 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问 1000 次
    poll: 1000
  }
}
```

> 使用 `webpack-dev-server` 和 `webpack-dev-middleware` 时， `watch` 默认开启。

`watchOptions` 的更多属性请查阅[官网](https://webpack.docschina.org/configuration/watch/#watchoptions)。

</br>

## externals(外部扩展)

**防止**将某些 `import` 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

例如，从 CDN 引入 jQuery，而不是把它打包:

``` html
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
```

``` js
module.exports = {
  externals: {
    jquery: 'jQuery'
  }
};
```

`externals` 除了能接收字符串外，还有其他语法，具体查看[官网](https://webpack.docschina.org/configuration/externals/)。

</br>

## node

这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行。

此功能由 webpack 内部的 `NodeStuffPlugin` 插件提供。如果 target 是 "web"（默认）或 "webworker"，那么 `NodeSourcePlugin` 插件也会被激活。

`node` 是一个对象其中每个属性都是 Node.js 全局变量或模块的名称，每个 value 是以下其中之一：

- `true`：提供 polyfill。
- `"mock"`：提供 mock 实现预期接口，但功能很少或没有。
- `"empty"`：提供空对象。
- `false`: 什么都不提供。预期获取此对象的代码，可能会因为获取不到此对象，触发 ReferenceError 而崩溃。尝试使用 require('modulename') 导入模块的代码，可能会触发 Cannot find module "modulename" 错误。

以下是 `node` 配置的默认值：

``` js
module.exports = {
  node: {
    console: false,
    global: true,
    process: true,
    __filename: 'mock',
    __dirname: 'mock',
    Buffer: true,
    setImmediate: true
    // 更多选项，请查看“其他 Node.js 核心库”。
  }
};
```

详细介绍请看[官网](https://webpack.docschina.org/configuration/node/)。

</br>
</br>

# 常用loader

## CSS 相关的 loader

与 CSS 相关的 loader 有好几个，其中 **`css-loader`** 是必须的，作用是加载`.css`文件，并且转化成`commonjs`对象。

### style-loader

经过 `css-loader` 处理的内容，可以通过 `style-loader` 将样式通过`<style>`标签插入到`<head>`标签内；

``` js
module.exports = {
  ...
  rules: [
    {
      test: /\.css/, use: [
        'style-loader',
        'css-loader',
      ]
    }
  ]
}
```

### MiniCssExtractPlugin.loader

除了"内嵌"，还使用 `MiniCssExtractPlugin.loader` 把样式提取到 `.css` 文件中。

  ``` js
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  module.exports = {
    ...
    rules: [
      {
        test: /\.css/, use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      }
    ],
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      })
    ]
  }
  ```

### px2rem-loader

使用 `px2rem-loader` 可以把 `px` 单位自动换算成 `rem` 。

``` js
module.exports = {
  ...
  rules: [
    {
      test: /\.css/, use: [
        {
          loader: 'px2rem-loader',
          options: {
            remUnit: 75, // 表示每 75px 替换成 1rem
            remPrecision: 8 // 表示转换后的 rem 值小数点位数
          }
        },
        'css-loader',
      ]
    }
  ],
```

需要注意，除了配置 `px2rem-loader` ，还需要写一个函数，**自动设置根元素的 `font-size`** 。

以上面的配置为例，假设设计稿的宽度是 `750px` ，当前设备的宽度是 `900px` 那么根元素的`font-size`应该是 `900/750*75` ，即 `font-size: 90px;` 。

### sass-loader

`sass-loader` 的使用请参考 [此demo](../Sass) 。

### post-loader

`post-loader` 的使用请参考 [此demo](../PostCSS) ，其中包含了 `autoprofixer` 插件，用于对CSS样式添加前缀。

### less-loader

`less-loader` 的使用请参考 [此demo](../Less) 。

</br>

## 其他文件资源

### url-loader

对于图片和字体这类非代码的文件，可以有两种方式解析：通过哈希值重名名文件；通过 base64 引入到代码文件中。

base64编码到代码中（url-loader），该loader还需要配置一个options属性，options是一个对象，用于指定最大用于base64的文件，否则使用file-loader。例子如下：

``` js
module.exports = {
  ...
  rules: [
    {
      test: /\.(png|jpg|gif)/, use: 'url-loader', options: {
        limit: 10240  // 单位是bit
      }
    },
  ]
}
```

### raw-loader

略，比较简单。作用是读取文件的文本。[官网](https://www.npmjs.com/package/raw-loader)。

## file-loader

略，比较简单。把特定类型的文件放到一个文件夹中，文件内容不会被修改。[官网](https://www.npmjs.com/package/file-loader)。

</br>

## eslint-loader

`eslint-loader` 的使用请参考 [此demo](../ESLint) 。

## babel-loader

`babel-loader` 的使用请参考 [此demo](../Babel) 。

</br>
</br>

# 常用plugin

## `clean-webpack-plugin`(清理原构建目录)

`clean-webpack-plugin` 用于清理上次构建的目录。用法也很简单。

``` js
// 注意， 3.0 版本的引入与之前略有不同，需要"解构赋值"
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  ...
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

</br>

## `friendly-errors-webpack-plugin`(精简输出打包日志)

默认情况下，打包构建时，会在命令行输出一大堆我们并不关注的日志，可以通过插件，使其只输出关键的日志内容，如warning、error、finish
使用插件friendly-errors-webpack-plugin，无参数。

</br>

## `uglifyjs-webpack-plugin`(JS代码压缩)

`uglifyjs-webpack-plugin` 是 webpack 自带的插件，用于对 js 文件的压缩。

</br>

## `optimize-css-assets-webpack-plugin`(CSS代码压缩)

css 的压缩需要使用 `optimize-css-assets-webpack-plugin` 插件，该插件还依赖 cssnano ，使用前注意都要安装，插件配置如下：

``` js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  ...
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    })
  ]
}
```

</br>

## `html-webpack-plugin`(HTML模板)

html 的压缩需要使用 `html-webpack-plugin` 插件。其主要作用是通过标签的形式应用其他资源。

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  ...
  plugins: [
    // 一个 html 文件需要一个 HtmlWebpackPlugin 插件
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search.html'),  // 被压缩的文件路径
      filename: 'search.html',  // 输出的文件名
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    })
  ]
}
```

</br>

## `webpack.HotModuleReplacementPlugin`(热更新)

热更新把打包内容**存放在内存**中。首先需要安装 `webpack-dev-server` 。

使用 `webpack` 自带的 `HotModuleReplacementPlugin` 插件，可以实现不刷新的热更新，但这不是绝对的，当 `HotModuleReplacementPlugin` 失败时会自动降级为 `liveload` 刷新页面。

``` js
// webpack 内置的插件
const { HotModuleReplacementPlugin } = require('webpack');
module.exports = {
  ...
  plugins: [
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
}
```

</br>

## 自定义函数

自定义函数可以处理构建异常和中断。

``` js
module.exports = {
  ...
  plugins: [
    function () {
      this.hooks.done.tap('done', stats => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('--watch ') == -1
        ) {
          console.log('build error');
          process.exit(1);
        }
      })
    }
  ]
}
```

</br>
</br>

# 懒加载JS脚本

所谓懒加载，就是在代码执行时才加载对应资源。

有两种方式：

- commonJs: `requird.ensure()`
- ES6: `import() // 返回的是一个 promise 对象，可以使用 then 方法，目前还没有原生支持，需要 babel 转换`
使用动态import：

安装 Babel 插件：`npm i @babel/plugin-syntax-dynamic-import -D`

Babel 配置：

``` json (.babelrc)
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"],
  "presets": […]
}
```

</br>
</br>

# 配置拆分

对于一个项目，可能有多种环境，但至少也有这两种情况：开发环境和生产环境。这两种环境的配置一般是不一样的，两者也有相同的配置。所以，我们把配置拆分成三部分：`webpack.config.dev.js`、`webpack.config.prod.js`、`webpack.config.base.js`。

对应的，需要把 `package.json` 文件的 `scripts` 对象添加两个属性：

``` js
"scripts": {
  "dev": "webpack-dev-server --config webpack.config.dev.js",
  "build": "webpack --config webpack.config.prod.js"
}
```

还有，因为 `webpack.config.dev.js`、`webpack.config.prod.js` 的相同配置都放在 `webpack.config.base.js` 中，所以两者都需要引入该配置。建议使用 **`webpack-merge`** 工具，该工具可以把同名对象和数组都自动合并，值类型则覆盖。该工具的语法如下：

``` js
const merge = require('webpack-merge');
// ....
module.exports = merge(baseConfig, devConfig);
```

</br>
</br>

# 文件指纹策略

打包后输出的文件名的附加名字，通常用于版本管理，判断该文件是否已更改。

可以设置输出文件名的地方都能用文件指纹策略。如 `output.filename` 、 `file-loader` 解析模块的 `rules[n].use.option.name` 等。

所有的占位符：

|    占位符     |                               含义                                |
|:-------------:|:-----------------------------------------------------------------:|
|     [ext]     |                            资源后缀名                             |
|    [name]     |                             文件名称                              |
|    [path]     |                          文件的相对路径                           |
|   [folder]    |                         文件所在的文件夹                          |
|    [hash]     |     和整个项目的构建相关，只要项目文件有修改，此值就发生变化      |
|  [chunkhash]  | 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash |
| [contenthash] |         和文件内容有关，文件内容不变，则 contenthash 不变         |
|    [emoji]    |                  一个随机的指代文件内容的 emoji                   |

例子： `[name][hash:8].[ext]` ，哈希后面的8表示只要前8位（共32位）， `ext` 表示按原文件的后缀。
