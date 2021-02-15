// 子进程获取传入的数据
process.on('message', str => {
  console.log('masterData:', str);
  // 子进程向调用方返回数据
  process.send('子进程已收到数据')
})