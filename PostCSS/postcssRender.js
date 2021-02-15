const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'dist_render');
fs.existsSync(dirPath) ? null : fs.mkdirSync(dirPath);
// 主模块
const postcss = require('postcss');
// 自动补全浏览器前缀
const autoprefixer = require('autoprefixer');
// 解析文件中类似于 sass 的语法
const precss = require('precss');
// 允许你使用未来的 CSS 特性 (根据目标浏览器或运行时环境确定所需的 polyfill)
// 其包含了 autoprefixer ，具体用法请看官网
const postcssPresetEnv = require('postcss-preset-env');


fs.readFile('index.css', (err, css) => {
  // 参数指定要使用的插件
  postcss([precss, autoprefixer])
    // 指定被解析文件
    .process(css, {
      from: 'index.css',
      to: 'dist_render/index.css'
    })
    // 对解析后的内容输出
    .then(result => {
      fs.writeFileSync('dist_render/index.css', result.css);
      if (result.map) fs.writeFileSync('dist_render/index.css.map', result.map);
    });
});