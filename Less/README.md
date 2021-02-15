
# 简介

Less(Leaner Style Sheets) 是一门向后兼容的 CSS 扩展语言。

除了编译成普通的 CSS ，还可以直接在浏览器使用 less 文件：

``` html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.10.0-beta/less.min.js"></script>
```

需要注意，加载外部资源需要启用 CORS ，所以本地直接打开 html 文件是会报跨域错误。

简单的介绍请看 [demo](./less_browser_demo) 。由于直接在浏览器使用 Less 的情况很少，且很消耗资源，这里不详细介绍，具体请看 [官网](http://lesscss.org/usage/#using-less-in-the-browser) 。

# 语法

具体的语法介绍请看 [index.js](./index.less) 文件内容。

# 与webpack的结合

使用的是 `less-loader` ，具体请看 [demo](./less_webpack_demo) 。
