
# Function

## 定义函数

函数**本质是对象**。每个函数都是 Function 类型的实例。

定义函数有两种方式：函数声明、函数表达式。

### 函数声明

使用 **`function`** 关键字 (会变量提升,但不建议这样做)，代码如下：

``` js
// 变量提升
console.log(fn);  // [Function: fn]
// function
function fn() {
  // 函数内容...
}
```

### 函数表达式

使用 **`var`** 或 **`let`** 关键字 (`var`会导致声明提升,同样不建议这样做)，代码如下：

``` js
// 声明提升
console.log(fn1);   // undefined
var fn1 = function () {
  // 处理代码...
}
// let 声明不会被提升
console.log(fn1);   // 报错！！！
let fn2 = function () {
  // 处理代码...
}
```

其实函数表达式是先定义了**匿名函数**(也叫**拉姆达函数**)，再将匿名函数赋值给变量。

### 其他

- **函数没有重载**

JavaScript 的函数没有重载，但可以通过判断参数个数或参数是否为 `undefined` 来区别处理。看如下例子：

``` js
function plus(num1, num2) {
  if (!num1) {
    return 0
  }
  if (num2) {
    return num1 + num2
  }
  return num1
}
console.log(plus());      // 0
console.log(plus(11));    // 11
console.log(plus(2, 1));  // 3
```

- **尽量不要使用 `Funtion()` 和 `new Funtion()` 创建函数**

``` js
let fn1 = new Function('return 1');
let fn2 = Function('return 2');
console.log(fn1(), fn2());    // 1 2
```

虽然以上代码无语法错误，但和 **`eval()`** 函数一样，**可能会被浏览器阻止**。

</br>

## ES6

### 函数参数默认值及解构赋值

参数定义时，可以为其提供**默认值**。这部分内容和**解构赋值**有关。[其他资料](./变量声明、解构赋值和展开运算符.md#解构赋值)。下面是简单的例子：

``` js
// 参数的默认值
function fn1(x, y = 2) {
  console.log(x, y)
}
// 参数的解构赋值
function fn2({ x, y }) {
  console.log(x, y)
}
// 参数声明时使用解构赋值
function fn3({x, y = 5} = {}) {
  console.log(x, y);
}
// 使用展开运算符和解构赋值
function fn4(...value) {
  console.log(value)
}
fn1(10);                // 10 2
fn2({ y: 22, x: 11 });  // 11 22
fn3();                  // undefined 5
fn4(1, 2, 3);           // [1,2,3]
```

### 函数对象的 `length` 属性

`length` 属性可以获取没有指定默认值的参数个数。看下面例子：

``` js
function fn1(x, y) { }
function fn2(x, y = 1) { }
console.log(fn1.length);    // 2
console.log(fn2.length);    // 1
```

### 箭头函数 `=>`

箭头函数的最大特点就是"绑定" `this` 的指向，使其指向定义时所在的对象。**基本语法**如下：

``` js
// 箭头后的圆括号表示直接返回的值
let addOne = (x, y) => (value + 1)
// 可以像普通匿名函数一样,处理和返回值 (单个参数可以省略箭头左边的括号)
let addTen = value => {
  value += 10;
  return value
}
console.log(addOne(1, 2));   // 3
console.log(addTen(1));      // 11
```

**注意**如下几点：

- 箭头函数内部**不存在 `this` 对象**，所以 `this` **指向定义时所在的对象**，而不是使用时所在的对象。
- **不能作为构造函数**，即不能使用 `new` 运算符。
- 箭头函数内部**不存在 `arguments` 对象**，但可以使用扩展运算符 `(...)` 。
- **不能用作 Generator 函数**，即不能使用 `yield` 运算符。

### 函数对象的 name 属性

函数的 `name` 属性，返回该函数的函数名。

``` js
function foo() {}
foo.name              // "foo"
// 函数赋值，但name仍返回原来函数的名字
baz = foo;
baz.name              // "foo"
// 绑定的函数会被加上"bound "
foo.bind({}).name     // "bound foo"
// 匿名函数，返回空字符串
(function(){}).name   // ""
```

### Promise 对象

关于 Promise 的介绍在[另一篇文章](./Promise.md)。

### 异步函数 (async function)

async function 的本质是 Promise 对象，**是 Promise 的语法糖**。所以，同样可以使用 `then()` 和 `catch()` 。

其内部能使用（也只能在其内部使用）的一个关键字 **`await` ，表示等待该行代码执行结束**，然后再继续后面的代码。

与 Promise 不同， async function 就是函数，只有被调用时才会执行，而非定义后马上执行。

下面给出简单例子：

``` js
// 2s 之后返回双倍的值
function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    } )
}
// 定义async函数
async function testResult() {
    console.log('---2s后打印resolve---');
    let result = await doubleAfter2seconds(30);
    setTimeout(() => {
        console.log('再过1.5s后打印"await"后语句')
    }, 1500)
    console.log(`result：${result}`);
}
testResult(30);
/* 打印结果：
  ---2s后打印resolve---
  result：60
  再过1.5s后打印"await"后语句
*/
```

为了加深理解，可以试试下面的一道题：

``` js
async function async1() {
  console.log( 'async1 start' );
  await async2();
  console.log( 'async1 end' );
}
async function async2() {
  console.log( 'async2' );
}
 
console.log( 'script start' );
setTimeout( function () {
  console.log( 'setTimeout' );
}, 0);
async1();
new Promise(function (resolve) {
  console.log( 'promise1' );
  resolve();
}).then(function () {
  console.log( 'promise2' );
});
console.log( 'script end' );
```

结果如下：

``` txt
script start
async1 start
async2
promise1
script end
promise2
async1 end
setTimeout
```

### 迭代器 (Iterator)

迭代器是一种特殊对象，它具有一些专门为迭代过程设计的专有接口，所有的迭代器对象都有一个 `next()` 方法，每次调用都返回一个结果对象。

结果对象有两个属性：一个是 `value` ，表示下一个将要返回的值；另一个是 `done` ，它是一个布尔类型的值，当没有更多可返回数据时返回 `true` 。

迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每调用一次 `next()` 方法，都会返回下一个可用的值。

如果在最后一个值返回后再调用 `next()` 方法，那么返回的对象中属性 `done` 的值为 `true` ，属性 `value` 若未定义，则为 `undefined` 。

觉得复杂的话，想想数组对象，它就是内置迭代器，循环遍历时（如`for`），就是调用迭代器，每一回的循环都 `.next().value` 获取值，直到结束。

下面以 Array 对象的 `values()` 方法获取一个迭代器：

``` js
let arr = ['a', 4, { a: 1 }];
let myIterator = arr.values();
console.log(myIterator.next().value);   // 'a'
console.log(myIterator.next().value);   // 4
console.log(myIterator.next().value);   // { a: 1 }
console.log(myIterator.next().done);    // true
```

### 生成器 (Generator)

生成器是**生成迭代器的函数**，通过 `function *` 或 `function*` 定义，函数中的特有关键字 `yield` ，表示当前迭代器返回的值，直到迭代器使用 `next()` ，则跳到下一个 `yield` 停顿，有点类似于 `return` 。下面给出简单例子：

``` js
const arr = ['blue', 'green', 'red'];
function *creatIterator(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 表示每次调用都返回arr[i]的值,与return类似
    yield arr[i];
  }
}
const item = creatIterator(arr);
console.log('第一次调用：' + item.next().value);
console.log('第二次调用：' + item.next().value);
console.log('第三次调用：' + item.next().value);
console.log('第四次调用：' + item.next().done);
/* 打印结果：
第一次调用：blue
第二次调用：green
第三次调用：red
第四次调用：true
*/
```

</br>

## 函数体内部的属性

函数被定义时，则自动创建两个属性： `arguments` 和 `this` ，且只能在函数内部使用。函数执行时会创建 `caller` 属性，指向调用本函数的外部函数。注意，这三个属性都在**严格模式**下 `('use strict')` **无法使用**。

### arguments 对象

arguments 是一个对应于传递给函数的参数的**类数组对象**。不是数组，但可以转化成数组。函数内部必定存在的一个对象。看下面一个例子：

``` js
function fn () {
  console.log(arguments);
}
fn('a', '', 'c');    // { '0': 'a', '1': '', '2': 'c' }
```

可以看出 `arguments` 依次包含 3 个参数。

`arguments` 对象内部还有 3 个**不可遍历的属性**：

- `argument.length`：参数的总个数。
- `argument.callee`：指向函数本身，可用于递归函数，但严格模式下调用会报错。
- **"迭代器"**：表示**可以使用 `for...of` 遍历** `arguments` 对象。

### this 对象

一般来说， **`this` 指向执行本函数的上下文**，但可以通过 `apply` 、 `call` 和 `bind` 方法改变指向。更多详细描述请查看[另一篇博文](./this的指向.md)。

### 函数执行时的属性（caller）

当本函数执行时， `caller` 属性指向**调用本函数的外部函数**；当本函数执行结束后， `caller` 会被赋值为 `null` 。看如下例子：

``` js
function foo() {
  function fn() {
    console.log('fn内部：',fn.caller);
  }
  function baz() {
    let obj = {}
    obj.myFn = fn;
    let globalFn = fn;
    obj.myFn();
    globalFn();
  }
  baz();
  console.dir('fn外部：',fn.caller);
}
foo();
// fn内部： function baz()
// fn内部： function baz()
// fn外部： null
```

</br>

## 递归函数

递归的定义是**函数内部调用函数自身**。上面提到可以用 `arguments.callee` 获取函数本身，但**严格模式下是不允许**的，看以下例子：

``` js
"use strict";
function fn(num) {
  console.log(num--)
  if (num > 0) {
    // 严格模式下会报错
    // arguments.callee(num);
    // 建议使用
    fn(num);
  }
}
```

</br>

## 几个关于函数的概念

### 头等函数 (first-class functions)

当一门编程语言的**函数可以被当作变量一样被使用**时，则称这门语言拥有头等函数。另一种说法是，函数是一等公民。

例如，在这门语言中，函数可以被**作为参数**传递给其他函数，可以**作为**另一个函数的**返回值**，还可以被**赋值**给一个变量。

以下示例都证明 JavaScript 是拥有头等函数。

``` js
// 函数复制给变量
let foo = function () { }
// 函数返回函数
function baz() {
  return function () { }
}
// 函数作为参数
function foz(foo) { }
```

### 高阶函数 (higher-order functions)

高阶函数是一个**接受其他函数作为参数**或**将函数作为返回值**返回的函数。以下给出两种高阶函数的例子。

``` js
function fn() { }
// 接受函数作为参数的高阶函数
function hof1(fn) { }
// 以函数做为返回值的高阶函数
function hof2() {
  return function () { }
}
```

### 一元函数 (unary functions)

一元函数是一个**只接受一个参数**的函数。与之对应的是多元函数 (multivariate functions)。

``` js
function uf(value) { }
```

### 柯里化 (currying)

柯里化是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。简单说就是，**减少函数的参数**。

``` js
// 未柯里化的函数
function sum(a, b, c, d) {
  return a + b * c - d
}
// 柯里化后的函数
function curryingSum1(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        return a + b * c - d
      }
    }
  }
}
// 箭头函数版的柯里化函数
let curryingSum2 = a => b => c => d => a + b * c - d
// 使用柯里化函数
curryingSum2(1)(2)(3)(4); // 3
```

上面例子可以看得出，箭头函数比较适合写柯里化的函数。

### 函数副作用

函数副作用是指函数在正常工作任务之外**对外部环境所施加的影响**，函数不仅仅只是返回了一个值，而且还做了其他的事情。

如下例子：

``` js
let myObject = { a: 1 }
function fn() {
  myObject.a = 11
  return true
}
```

函数副作用的函数也称为**非纯函数 (Impure Function)**。

### 纯函数 (pure functions)

输入输出数据流全是显式(Explicit)的，意思是，**函数与外界交换数据只有一个唯一渠道 ——— 参数和返回值**。

函数从函数外部接受的所有输入信息都通过参数传递到该函数内部。函数输出到函数外部的所有信息都通过返回值传递到该函数外部。

简单说就是，**没有副作用的函数**。

``` js
function add1(a) {
  return a + 1
}
```

</br>

## 闭包函数

闭包函数指的是有权访问另一个函数作用域中的变量的函数。

[链接](./闭包.md)。

</br>

## 函数高级用法

[链接](./函数高级用法.md)。
