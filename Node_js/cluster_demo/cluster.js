const os = require('os');
const cluster = require('cluster');
// 这里会打印多次，只有第一次是 true ，即主进程
console.log(cluster.isMaster);
if (cluster.isMaster) {
  // 根据当前设备的核心数，创建特定数量的子进程
  // 注意，全部使用并不一定带来性能上的提升，因为 node 本身就利用了 cpu 的多个核心，且多个进程消耗的内存也是很高
  for (let i = 0; i < os.cpus().length / 2; i++) {
    cluster.fork();
  }
  // 监听子进程是否退出
  cluster.on('exit', _ => {
    // 可以在子进程退出时，重新启动一个新的子进程填补空缺
    setTimeout(() => {
      cluster.fork();
    }, 3000);
  });
} else {
  // 子进程执行的代码
  require('./app.js');
}