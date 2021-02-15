const fs = require('fs');
const path = require('path');


// demo 运行方法： node app.js <arg> 。通过不同的 <arg> 执行下面不同的案例。


// 场景1：检测目录是否存在，无则创建
if (arg == 1) {
  let _path = path.join(__dirname, 'dist');
  // 检测路径是否存在 (注意,"exists"方法已被弃用)
  let isExist = fs.existsSync(_path);
  if(!isExist){
    // 创建文件夹
    fs.mkdirSync(_path);
  }
}