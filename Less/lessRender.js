const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname, 'dist');
fs.existsSync(outputPath) ? null : fs.mkdirSync(outputPath);
const less = require('less');

let input = fs.readFileSync(
  path.join(__dirname, 'index.less')
);
/**
 * @function render(lessInput,options?)
 * @param {String} lessInput 需要编译的 Less 内容字符串。
 * @param {Object} options 是可选的，与命令行的参数都是对应的 (http://lesscss.org/usage/#less-options) 。
 */
less.render(input.toString(), {
    /*
      // 包含的路径
      paths: ['PATH1', 'PATH2'],
      // 指定根路径 (影响 @import 的相对路径)
      rootpath: './',
      // 改写URL。默认是"off",保持原URL。(具体看官网例子: http://lesscss.org/usage/#less-options-rewrite-urls)
      rewriteUrls: 'off',
      // 严格单位
      strictUnits: false,
      // 该声明放置在基本Less文件的顶部，这意味着可以使用该声明，但是如果在文件中定义了此变量，也可以将其覆盖。
      globalVars: {
        color1: 'red'
      },
      // 与全局变量选项相反，这会将声明放在基本文件的末尾，这意味着它将覆盖Less文件中定义的所有内容。
      modifyVars: {
        color1: 'red'
      },
      // url参数，用于缓存清除。
      urlArgs: 'cache726357',
      // 运行较少的解析器，仅报告错误而没有任何输出。
      lint: true,
      // 允许从不安全的HTTPS主机导入
      insecure: true,
      // Source Map
      sourceMap: {
        // 输出文件名
        outputFilename: 'file.map',
        // 根路径
        sourceMapRootpath: 'dev-files/',
        // 基本路径
        sourceMapBasepath: 'less-files/',
        // 输出 source map 文件
        outputSourceFiles: true,
        // 使用行内 source map
        sourceMapFileInline: true,
        // 允许您覆盖指向映射文件的css中的URL。这适用于rootpath和basepath选项不能生成所需内容的情况。
        sourceMapURL: '../my-map.json'
      }
      */
  })
  .then(function (output) {
      fs.writeFileSync(path.join(outputPath, 'output.css'), output.css)
    },
    function (error) {
      // ...
    });



// 或这种写法
// less.render(css, options, function(error, output) {})