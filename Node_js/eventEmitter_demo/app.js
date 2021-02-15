const EventEmitter = require('events');
const arg = process.argv[2]


// demo 运行方法： node app.js <arg> 。通过不同的 <arg> 执行下面不同的案例。


// 继承 EventEmitter
if (arg == 1) {
  class MyEventEmitter extends EventEmitter {
    // 添加类成员
    constructor() {
      super();
      this.msg = 0
    }
  }
  // 创建
  let myEventEmitter = new MyEventEmitter();
  // 注册监听器 (默认情况下,回调函数的参数个数与"触发器"提供的个数一致)
  // 除了"on"，还可以使用"addListener"，两者等效
  myEventEmitter.on('myEventName', function (...args) {
    console.log(this.msg, args); // 0 [ 'a', 'c', 'b' ]
  });
  // 触发事件
  myEventEmitter.emit('myEventName', 'a', 'c', 'b');
  return;
}


// 内置事件： 'newListener' 和 'removeListener'
if (arg == 2) {
  const myEmitter = new EventEmitter();
  // "once"表示监听器只触发一次 (监听器会先被移除,然后再调用)
  myEmitter.once('newListener', (eventName, listener) => {
    console.log('新增事件：', eventName); // 新增事件：myEventName
  });
  myEmitter.on('removeListener', (eventName, listener) => {
    console.log('被移除事件：', eventName); // 被移除事件：myEventName
  });
  const cb = () => {}
  // 添加监听器。会触发"newListener"事件。
  myEmitter.on('myEventName', cb);
  // 移除监听器。会触发"removeListener"事件。 (可以使用"removeListener"移除事件,与"off"等效)
  myEmitter.off('myEventName', cb);
  return;
}


// 默认情况下，每个事件可以注册最多 10 个监听器。 (注意"每个事件",即同名事件的监听器数量限制)
if (arg == 3) {
  const myEmitter = new EventEmitter();
  // 获取实例的最大监听器个数 (默认 10 个)
  console.log(myEmitter.getMaxListeners()); // 10
  // 修改单个实例对象的最大监听器个数 (EventEmitter的同名静态方法可以修改所有的)
  myEmitter.setMaxListeners(11);
  // 虽然监听器有个数限制，限制不是硬性的。 EventEmitter 实例可以添加超过限制的监听器，但会向 stderr 输出跟踪警告，表明检测到可能的内存泄漏。
  process.on('warning', err => {
    console.log(err.name); // "MaxListenersExceededWarning"
    console.log(err.emitter); // EventEmitter (事件触发器实例)
    console.log(err.type); // "myEvent" (事件名称)
    console.log(err.count); // 12 (监听器数量)
  });
  // 添加超出个数限制的监听器
  for (let i = 0; i < 12; i++) {
    myEmitter.on('myEvent', () => {});
  }
  // 获取指定事件的已注册的监听器数量
  console.log(myEmitter.listenerCount('myEvent')); // 12
  // 获取所有监听器的事件名数组
  console.log(myEmitter.eventNames()); // [ 'myEvent']
  // 获取指定事件名的监听器数组的副本 ("rawListeners"也有同样的功能,两者的区别暂不清楚)
  console.log(myEmitter.listeners('myEvent')); // [ [Function], [Function], ... [Function] ]
  // 给定若干个事件名，清空其所有监听器
  myEmitter.removeAllListeners(['myEvent']);
  return;
}


// 事件监听器触发是有顺序的
if (arg == 4) {
  const myEmitter = new EventEmitter();
  // 使用"on"添加的监听器是以"队列"的方式添加，即"先添加后触发"
  myEmitter.on('myEvent', () => {
    console.log(1);
  });
  myEmitter.on('myEvent', () => {
    console.log(2);
  });
  myEmitter.emit('myEvent'); // 1 2
  // 使用"prependListener"添加的监听器是以"栈"的方式添加，即"先添加先触发"
  myEmitter.prependListener('myEvent', () => {
    console.log('a');
  });
  myEmitter.emit('myEvent'); // a 1 2
  // 以"栈"的方式添加"单次"监听器
  myEmitter.prependOnceListener('myEvent', () => {
    console.log('b');
  });
  return;
}

