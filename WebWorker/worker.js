/**
 * webWorker 的数据传递：
 * 1. 外部通过 Worker 实例对象的 .postMessage() 方法传入参数
 * 2. webWorker 内通过全局的 postMessage() 方法传出数据
 * 3. 类似的，都是通过 onmessage 指定监听器，从而获取数据
 * 
 * webWorker 的注意事项：
 * 1. webWorker 内部不能访问 window 或 global 对象，也不能访问 DOM
 * 2. onmessage 监听器的参数 Event 中，data 属性获取数据
 * 3. postMessage() 方法可以调用多次，以达到多次传参的效果
 * 4. 这里的 this 会指向 DedicatedWorkerGlobalScope 对象
 * 5. 创建 webWorker 的URL会受同源限制
 * 6. 这里调用方法 close() 可以终止本线程
 * 7. 这里还能创建"子线程"，但"子线程"和本线程必须托管在同源的父页面，获取的脚本也是相对同一个父页面
 */


onmessage = function (e) {
  let timestamp = e.data
  while (new Date().getTime() - timestamp <= 5000) {}
  postMessage(new Date().getTime() - timestamp)
}
