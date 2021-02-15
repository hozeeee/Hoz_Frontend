const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const dirPath = path.join(__dirname, 'dist_render');
fs.existsSync(dirPath) ? null : fs.mkdirSync(dirPath);


/**
 * @function render(options,functions)
 * @param {Object} options 配置(具体看下面介绍)
 * @param {Function} callback(err,result) 编译完成后的回调函数 (版本 >= v3.0.0)
 *      callback@param {Object} err 编译错误时包含的信息，包含如下属性：
 *          message (String)-错误消息。
 *          line (Number)-错误的行号。
 *          column (Number)-错误的列号。
 *          status (Number)-状态代码。
 *          file (String)-错误的文件名。
 *      callback@param {Object} result 编译成功时包含的信息
 *          css (Buffer)-编译后的CSS。
 *          map (Buffer)-源映射。
 *          stats (Object)-包含有关编译信息的对象。它包含以下键：
 *              entry (String)-scss文件的路径，或者data源不是文件
 *              start (Number)-编译前的Date.now()
 *              end (Number)-编译后的Date.now()
 *              duration (Number)- 结束 - 开始
 *              includedFiles (Array)-指向所有相关scss文件的绝对路径，没有特定的顺序。
 */
sass.render({
  // 指定解析的sass文件
  file: './index.scss',
  /**
   * 当被解析文件内有"@import"引入别的样式文件，将触发此函数  (版本 >= v2.0.0)
   * importer 可以是"函数组"(Function[])
   * @param {String} url "@import"后的路径
   * @param {String} prev 当前文件
   * @param {{file?, contents?}} done 回调函数 (接收包含两个参数的对象)
   *      done@param {String} file 被替换的路径
   *      done@param {String} contents 被替换的路径
   * @注意 "done"函数必须被调用，除非使用"return"，否则会一直停在该函数内不会结束
   *      当调用"done"回调函数，则是异步执行；使用"return"时，函数为同步执行
   *      当引入".css"文件，不会读取其内容，即不会把文件内容替换到"@import"的位置
   *      当"done"的参数指定了"contents"，"file"就会被忽略
   */
  importer(url, prev, done) {
    if (!url.includes('sub.scss')) return {
      file: url
    }
    done({
      file: './test_import/sub2.scss',
      // contents: '.text{font-size:20px;}'
    });
  },
  /**
   * functions 用于解析内容中的"自定义函数"  (版本 >= v3.0.0)
   * 指定多个自定义函数的解析方法 (看下面代码)
   * 自定义方法可以作用于 属性值 ，也可以作用于 css选择器 (看index.scss文件)
   * "解析函数"的参数与返回值都是"require('node-sass').types"中包含的构造函数之一的实例
   * 关于"require('node-sass').types"的可用构造函数，请查阅官方文档 (https://www.npmjs.com/package/node-sass#functions--v300---experimental)
   * "解析函数"的最后一个参数必定是"done"回调函数 (用法与"importer"相同)
   */
  functions: {
    // #box1 {padding: myPadding(1, 2, 3, 4);}
    'fourSidePx($top:0,$right:0,$bottom:0,$left:0)': function (...paddings) {
      let resultStr = ''
      for (let i = 0, len = 4; i < len; i++) {
        resultStr += `${paddings[i].getValue()}px${i===3?'':' '}`
      }
      // done(new sass.types.String(resultStr));
      return new sass.types.String(resultStr)
    },
    // 官方实例
    'headings($from:0,$to:6)': function (from, to) {
      var i, f = from.getValue(),
        t = to.getValue(),
        list = new sass.types.List(t - f + 1);
      for (i = f; i <= t; i++) {
        list.setValue(i - f, new sass.types.String('h' + i));
      }
      return list;
    }
  },
  // 为"@import"提供快捷路径，如"@import 'sub4.scss';"会先搜索当前文件夹，若没有，就从"includePaths"提供的路径中寻找。
  includePaths: ['./test_import'],
  /**
   * 设置是否使用 "缩进语法" 。布尔值，默认 false ，即使用传统的 css 语法。
   * (缩进语法,就是"不适用花括号"的一种写法,类似于python的语法,详看官网介绍：https://sass-lang.com/documentation/syntax)
   */
  indentedSyntax: true,
  // 关于"缩进"的 3 个属性
  indentType: 'tab', // 'space'(默认)或'tab'。设置缩进的样式。  (>= v3.0.0)
  indentWidth: 2, // 正整数(1~10),默认2。设置缩进的宽度。  (>= v3.0.0)
  /**
   * 设置换行方式，可选值： "cr", "crlf", "lf"(默认) or "lfcr"
   * CR(Carriage Return)：回车
   * LF(Linefeed)：换行
   * CRLF(Carriage Return & Linefeed)：回车并换行
   * LFCR(Linefeed & Carriage Return)：换行并回车
   */
  linefeed: 'lf',
  // 输出文本的样式
  outputStyle: 'nested', // 可选值： nested(默认,嵌套), expanded(展开), compact(压缩,带换行), compressed(压缩,不带换行)
  // 设置浮点数精度 (精确到小数点后几位,注意,需要被"解析"的部分才会被此属性影响,像"width: 3.141592653589793px;"是不会被此属性影响)
  precision: 5, // 正整数,默认是5
  /**
   * 设置 sourceMap (编译后的文件与源文件的映射)
   * 可选值： Boolean | String | undefined(默认)
   * 当设为 true 时，以 "outFile" 的值作源映射的目标输出位置；
   * 当设为 String 时，则指定源映射的目标输出位置。
   */
  sourceMap: true,
  outFile: path.join(dirPath, 'index.css.map'), // string 或 null(默认)
  // 是否禁用 source map (设为false时应同时配置"outFile"选项) TODO:具体作用不明
  omitSourceMapUrl: true, // 布尔值,默认false
  // 是否显示 sourceMap 注释内容
  sourceComments: false, // 布尔值,默认false
  // sourceMap 中是否显示 sourcesContent
  sourceMapContents: true, // 布尔值,默认false
  // 是否将源地图嵌入为数据URI TODO:具体作用不明
  sourceMapEmbed: true, // 布尔值,默认false
  // sourceMap 中是否显示 sourceRoot
  sourceMapRoot: path.join(dirPath, 'index.css.map'),
}, function (err, result) {
  // 输出 css 文件
  fs.writeFile(path.join(dirPath, 'index.css'), result.css, function (err) {
    if (!err) {
      console.log('css 输出成功');
    }
  });
  // 输出 map 文件
  fs.writeFile(path.join(dirPath, 'index.css.map'), result.map, function (err) {
    if (!err) {
      console.log('map 输出成功');
    }
  });
});



// 还有一个同步执行的方法 (没有回调函数)
// const result = sass.renderSync({ file, importer, ... });
// console.log(result.css);
// console.log(result.map);
// console.log(result.stats);