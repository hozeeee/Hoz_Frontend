// 根据字符长度，生成对应的 buffer
const buffer1 = Buffer.from('hello world');
// 数组每个成员都占一位buffer (可能会溢出)
const buffer2 = Buffer.from([1, 16, 3]);
// 创建长度为10的空buffer
const buffer3 = Buffer.alloc(10);

console.log(buffer1); // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
console.log(buffer2); // <Buffer 01 10 03>
console.log(buffer3); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// TODO: 写入buffer


// 利用 protocol-buffers 库读写 buffer
const protobuf = require('protocol-buffers');
const fs = require('fs');
// 读取 数据结构 文件
const messages = protobuf(fs.readFileSync('./test.proto'));
// 以特定数据结构"编码"buffer  (注意,Person是.proto文件中定义的)
const buffer4 = messages.Person.encode({
  id: 111,
  name: 'baz',
  age: 20.3
});
console.log(buffer4); // <Buffer 08 6f 02 03 62 61 7a 95 01 66 66 a2 41>

// 以特定的数据结构"解码"buffer
let data = messages.Person.decode(buffer4);
console.log(data);  // { id: 111, name: 'baz', age: 20.299999237060547 }
