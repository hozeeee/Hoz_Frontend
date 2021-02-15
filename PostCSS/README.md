
# 简介

[PostCSS](https://github.com/postcss/postcss/blob/master/README-cn.md) 是一个允许使用 JS 插件转换样式的工具。该工具本身是一个Node.js 模块，可将 CSS 解析为抽象语法树(AST)；通过任意数量的"插件"功能传递 AST ；然后将该 AST 转换回字符串，然后可以将其输出到文件中。与 SASS 和 LESS 等"预处理器"不同，可以理解是"后处理器"，两者不是取代关系。

查阅 [PostCSS API](http://api.postcss.org/postcss.html) 可以了解 `postcss` 模块对象中的各个成员属性。

PostCSS 可以使用的插件有很多，插件也能自行"组合"使用，甚至自己写插件，[官方插件集](https://github.com/postcss/postcss/blob/master/docs/plugins.md)。

</br>

# JS API 的使用

- 运行 `npm i` 安装依赖包，可以通过 [package.json](./package.json) 查看需要那些包。

- 查看 [postcssRender.js](./postcssRender.js) 文件的代码。

- 运行 `node postcssRender` 执行JS代码。

- 运行命令后会同目录下会生成 `dist_render` 文件夹，其中 `index.css` 就是输出文件。

</br>

# 在 webpack 中的使用

- 运行 `npm i` 安装依赖包，可以通过 [package.json](./package.json) 查看需要那些包。

- 请参考 [webpack.config.js](./webpack.config.js) 文件的配置。

- 此外，还需要创建 PostCSS 的配置文件 [postcss.config.js](./postcss.config.js) ，指明使用的插件包，用法也很简单。

- 然后运行 `npm run build` 查看效果。

- 运行命令后会生成 `dist_webpack` 文件夹，其中的 `main.css` 就是输出文件。

</br>

# Autoprefixer

[Autoprefixer](https://github.com/postcss/autoprefixer)的作用是**向 CSS 规则添加供应商前缀**，也就是说，若浏览器完全不支持某个 CSS 属性， Autoprefixer 也帮不了你。Autoprefixer 的使用很简单，没必要多介绍的，只需要在 PostCSS 配置此插件即可。

- 通过 [CAN I USE](https://caniuse.com/) 可以查询某个 CSS 属性的兼容情况。

- Autoprefixer 是需要配置 [browserslist](https://github.com/browserslist/browserslist) 。

- browserslist 的配置可以在两处：（推荐在`package.json`中配置,两者同时配置会报错）

  - `package.json` 文件中的 `browserslist` 属性

    ``` json
    {
        ...
        "browserslist": [
            "> 1%",
            "last 2 versions",
            "not ie <= 8",
            "iOS >= 8",
            "Firefox >= 20",
            "Android > 4.4"
        ]
    }
    ```

  - 项目根目录的 `.browserslistrc` 文件。

    ``` .browserslistrc
    > 1%
    last 2 versions
    not ie <= 8
    iOS >= 8
    Firefox >= 20
    Android > 4.4
    ```

- 查询语法的 [完整清单](https://github.com/browserslist/browserslist#full-list) ； [浏览器列表](https://github.com/browserslist/browserslist#browsers) 。

</br>
