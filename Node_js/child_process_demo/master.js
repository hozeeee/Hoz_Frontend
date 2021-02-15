const path = require('path')
const cp = require('child_process');
// 使用指定的 js 文件创建子进程
const childProcess = cp.fork(path.join(__dirname, 'child.js'));
// 想子进程发数据
childProcess.send('hello child');
// 监听紫禁城返回的数据
childProcess.on('message', str => {
  console.log('childData: ', str)
})