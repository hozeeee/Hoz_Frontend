console.log(process.argv)

// 指定输入流的编码格式
process.stdin.setEncoding('utf8');
// 监听输入流 (会使得此脚本"持久化")
process.stdin.on('data', input => {
  // 注意，当输入结束时会按"回车"，导致输入流的结尾是"\r\n"，不能用"==="判断
  if (input.includes('exit')) {
    // "杀死"进程
    process.exit()
  }
  // 若未通过 setEncoding 方法设置编码格式，input 是一个 Buffer
  let num = Number.parseFloat(input)
  if (Number.isNaN(num)) {
    // 输出"错误流"
    process.stderr.write('请输入数字\r\n');
  } else {
    // 使用"输出流"输出到控制台
    num *= 2
    process.stdout.write(num.toString() + '\r\n');
  }
});