
# 简介

[SASS](https://www.sass.hk/) 是 CSS 扩展语言，使用特有的语法，编译出原生的 CSS 。其作用类似于 Typescript 的作用。

对于 SASS ，有两种可选的文件名后缀： `.scss` 和 `.sass` 。理论上不会对内部文件有所影响，但官方的定义中， `.scss` 是以常规CSS的写法，即使用花括号(`{}`)； `.sass` 是使用类似于 `python` 的写法，不使用花括号，用回车和 `tab` 代替。

而 [node-sass](https://github.com/sass/node-sass) 是 node 社区的根据 SASS 做出的一个编译器，是一个 node 的模块。

</br>

# 安装

1. 全局安装 node-gyp ： `npm install node-gyp -g` (注意， node-gyp 在window系统上还依赖 python 和 VisualC++，请根据[指引](https://github.com/nodejs/node-gyp#on-windows)对应安装)。

2. 安装 node-sass ： `npm install node-sass` 。

3. 若上面两步不能正常安装，请查看[故障排除](https://github.com/sass/node-sass/blob/master/TROUBLESHOOTING.md)，可能还需要"科学上网"。

注，管理员权限运行 `npm install --global --production windows-build-tools` 可以安装 `python2.7` 和 `vc++` 。

</br>

# webpack 与 node-sass 结合使用

- 除了 node-sass ，还需要安装 webpack 及 [sass-loader](https://www.npmjs.com/package/sass-loader) ： `npm i sass-loader css-loader webpack webpack-cli -D` 。

- 若需要输出单独的 CSS 文件，还需要安装 webpack 的插件 [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) ： `npm i mini-css-extract-plugin -D` 。

- 完成上面的安装后，控制台可能会打印出一些警告，若提示**缺少某些依赖包**或**依赖包的版本不符**，请对应安装。

- 然后就是配置 webpack.config.js ，具体内容请[查看文件](./webpack.config.js)。

- 此目录下运行 `npm run build` ，后查看 [dist_webpack](./dist_webpack) 目录下生成的文件。

</br>

# 运行测试说明

- 单纯测试 node-sass ，请在根目录运行 `node sassRender.js` 。之后会在同目录输出 css 和 map 文件，默认是 `index.css` 和 `index.css.map` 。

- 测试 webpack 对 sass 的打包，请在根目录运行 `npm run build` 。

# 其他

- SASS 的语法都在 [index.scss](./index.scss) 文件中。

- node-sass 编译器的使用方法都在 [sassRender.js](./sassRender.js) 文件中，包括编译配置的选项。

- 与 sass 相关的 webpack 配置在 [webpack.config.js](./webpack.config.js) 文件中。
