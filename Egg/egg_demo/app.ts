// // 此文件不是必须的！！！

// import { Application, Service } from "egg";

// module.exports = (app: Application) => {
//   // TODO: 还能做些什么....


//   // 仅触发一次，在 HTTP 服务完成启动后
//   app.once('server', (server:Service) => {
//     // websocket
//   });
//   // 发生错误时，一般用于日志记录或上报等操作
//   app.on('error', (err, ctx) => {
//     // report error
//   });
//   // 接收到请求时
//   app.on('request', ctx => {
//     // log receive request
//   });
//   // 响应请求时（TODO:前还是后）
//   app.on('response', ctx => {
//     // ctx.starttime is set by framework
//     // const used = Date.now() - ctx.starttime;
//     // log total cost
//   });
// };
