
# Promise

## 概述

`Promise` 对象是一个代理对象（代理一个值），被代理的值在 `Promise` 对象创建时可能是未知的。

`Promise` 对象有**三种状态**: `pending`(初始状态)、`fulfilled`(成功状态)、`rejected`(失败状态)。

`Promise` 对象的状态一旦由 `pending` 变为 `fulfilled` 或 `rejected` 将**无法再更改**。

`Promise` 对象的状态变为 `fulfilled` 后，通过 `then()` 方法执行回调函数；状态变为 `rejected` 后，通过 `catch()` 方法执行回调函数。

在 ES2018 中引入了 `finally()` ，表示该 `Promise` 执行结束后（无论是 `then` 还是 `catch` 导致的结束）都会执行传入 `finally` 方法的回调函数，回调函数无参数。

</br>

## 简单示例

### 创建

通过 `new` 运算符可以创建 `Promise` 实例，**唯一参数是带有 `resolve` 和 `reject` 两个参数的 executor 函数**。 `resolve` 和 `reject` 函数被调用时，分别将 `Promise` 的状态改为 `fulfilled`(完成) 或 `rejected`(失败) ，两个函数都接受一个参数，作为成功(或失败)的信息传递给对应的处理方法(`then`或`catch`)。

``` js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('resolve');
    } else {
      reject('reject');
    }
  }, 1000);
});
```

上述例子中，1 秒后随机把 `Promise` 对象的状态改为 `fulfilled`(完成) 或 `rejected`(失败) 。

### 处理

被创建的 `Promise` 对象会立即执行 `executor` 函数，如果我们还需要在该异步函数结束后再做点什么，就需要调用 `Promise` 对象的 `then()`、`catch()`和`finally()` 方法。（三个方法都会返回一个新的 `Promise` 对象，因此能使用"**链式操作**"）

接上例子：

``` js
p.then(res => {
  console.log(res);   // 'resolve'
}).catch(err => {
  console.log(err);   // 'reject'
}).finally(()=>{
  console.log('finally');    // 必定执行
});
```

可以看出，`then()` 和 `catch()` 方法传入的是一个回调函数，该回调函数有唯一参数，对应的是 `resolve` 和 `reject` 函数传入的参数。 `finally()` 同样是传入一个对调函数，不同的是该回调函数无参数。

### 几种场景

场景1：多个 `Promise` 需要**依次执行**。（`Promise.prototype.then()`**可以传入另一个 `Promise` 对象**）

``` js
const promise1 = new Promise(...);
const promise2 = new Promise(...);
const promise3 = new Promise(...);
// promise1成功执行后再执行promise2，再是promise3
promise1.then(promise2).then(promise3);
```

场景2：多个 `Promise` 需要**都成功**。（静态方法：`Promise.all()`）

``` js
const promise1 = new Promise(...);
const promise2 = new Promise(...);
const promise3 = new Promise(...);
// promise1/2/3 均成功后再执行 then ( 其中一个失败也不会执行 then )
Promise.all([promise1, promise2, promise3]).then(callback(){...});
```

场景3：多个 `Promise` 只需要**其中一个成功**。（静态方法：`Promise.race()`）

``` js
const promise1 = new Promise(...);
const promise2 = new Promise(...);
const promise3 = new Promise(...);
// promise1/2/3 任意一个成功后执行 then
Promise.race([promise1, promise2, promise3]).then(callback(){...})
```

### `Promise.resolve()`

`Promise.resolve()` 用于生成一个状态为 `fulfilled` 的 `Promise` 对象。其参数与 `.prototype.resolve()` 一致。

``` js
let p1 = Promise.resolve('resolve');
// 等效如下代码
let p2 = new Promise((resolve, reject) => {
  resolve('resolve');
});
```

### `Promise.reject()`

`Promise.reject()` 用于生成一个状态为 `rejected` 的 `Promise` 对象。其参数与 `.prototype.reject()` 一致。

``` js
let p1 = Promise.reject('resolve');
// 等效如下代码
let p2 = new Promise((resolve, reject) => {
  reject('resolve');
});
```

</br>

## 继续深入了解

### `then()` 的第二个参数

其实上面的介绍中，完全没有提及 `then()` 的第二个参数，因为其作用与 `catch()` 方法一致。看下面例子：

``` js
let p = new Promise((resolve, reject) => {
  reject('reject');
})
p.then(res => { }, err => {
  console.log(err);     // 'reject'
});
p.catch(err => {
  console.log(err);     // 'reject'
});
```

### 不传参的 `then()`/`catch()`/`finally()`

当 `then()`/`catch()`/`finally()` 不传入参数，都会**返回与原 `Promise` 对象相同(但不相等)的新 `Promise` 对象**。看如下例子：

``` js
// 不传参的"then"
let p1 = Promise.resolve('resolve');
let p2 = p1.then();
p2.then(res => {
  console.log(res);       // 'resolve'
});
console.log(p1 === p2);   // false
// 不传参的"catch"
let p3 = Promise.reject('reject');
let p4 = p3.catch();
p4.catch(res => {
  console.log(res);       // 'reject'
});
console.log(p3 === p4);   // false
// 不传参的"finally"
let p5 = Promise.resolve('resolve');
let p6 = p5.finally();
p6.then(res => {
  console.log(res);       // 'resolve'
});
console.log(p5 === p6);   // false
```

### `then()`/`catch()`/`finally(`) 的参数是带返回值的回调函数

当 `then()` 或 `catch()` 的参数是有返回值的回调函数 A ， `then()` 或 `catch()` 会**返回一个状态为fulfilled的Promise对象**。新 `Promise` 对象的 `then()` 方法的回调函数的参数就是回调函数 A 的返回值。

注意，状态为 `reject` 的 `Promise` 对象在 `then()` 的第一个对调函数返回会导致报错。

注意， `finally()` 的对调函数"`return`"并不会影响新的 `Promise` 对象的 `then()` 或 `catch()` 方法的回调函数的参数值。

如果觉得文字描述有点绕，看下面例子：

``` js
// 'resolve'状态被处理后的'return'
Promise.resolve('resolve').then(() => {
  return 'return1'
}).then(res => {
  console.log(res)
});   // 'return1'
// 'reject'状态被处理后的'return'
Promise.reject('resolve').catch(() => {
  return 'return2'
}).catch(err => {
  console.log('catch:', err)
}).then(res => {
  console.log('then:', res)
});   // 'then: return2'
// 'finally'的'return'只会返回与原promise相同的对象
Promise.resolve('resolve').finally(() => {
  return 'return3'
}).then(res => {
  console.log(res)
});   // 'resolve'
// 'reject'状态未被处理的'return'
Promise.reject('reject').then(() => {
  return 'return4'
}).then(res => {
  console.log(res);
});   // 报错！！
```

### `.resolve()` 的参数

`resolve()`（包括 `Promise.reject()` 和 `Promise.prototype.reject()`）除了上面介绍的用法，还能**传入** thenable (即，带有 `then` 方法的对象)，返回的 `Promise` 对象的最终状态由 `then` 方法执行决定。

注意， thenable 的 `then()` 方法只有传入唯一一个回调函数才会被执行，其他参数会被忽略。

看如下例子：

``` js
let thenable = {
  then(cb1, cb2) {
    cb1('cb1');
    cb2('cb2');
  }
}
// Promise.resolve()
Promise.resolve(thenable).then(
  res1 => {
    console.log(res1);  // 'cb1'
  },
  res2 => {
    console.log(res2);  // 不会执行
  }
).catch(err => {
  console.log(err);     // 不会执行
});
// Promise.prototype.resolve()
new Promise((resolve, reject) => {
  resolve(thenable);
}).then(res => {
  console.log(res);     // 'cb1'
});
```
