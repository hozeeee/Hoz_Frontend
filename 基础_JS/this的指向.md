
# this 的指向

`this` 是一个指针，**指向的是函数执行的环境对象**。

## 举例说明 `this` 的指向

### 普通函数

普通函数内的 `this` **指向执行环境对象**，例子中的执行环境是 `window` 。

``` js
var a = 'window'
function fn(){
  let a = 'fn'
  return this.a
}
fn();        // 'window'
```

### 构造函数创建的对象的方法内

构造函数创建的对象的方法内的 `this` **指向该对象**，例子中的 `this` 指向是 `obj` 。

``` js
function Fn(){
  this.a = 'Fn'
  this.getA = function(){
    return this.a
  }
}
var obj = new Fn()    // {a:'Fn',getA(){return this.a}}
obj.a;        // 'Fn'
obj.getA()    // 'Fn'
```

### 对象中的方法内

对象中的方法内的 `this` **指向对象本身**，**即对象为该方法的执行环境**。其本质是上例子的语法糖。

``` js
var a = 'window'
var obj = {
  a: 'obj',
  getA(){
    return this.a
  }
}
obj.getA();    // 'obj'
```

</br>

## 改变 `this` 指向

### 函数赋值

赋值可能会使函数内的 `this` 指向发生改变。

``` js
var a = 'window'
var obj1 = {
  a: 'obj1',
  getA: null
}
var obj2 = {
  a: 'obj2',
  getA(){
    return this.a
  }
}
console.log(obj2.getA())    // 'obj2'
obj1.getA = obj2.getA
console.log(obj1.getA())    // 'obj1'
var getA = obj2.getA
console.log(getA())         // 'window'
```

## apply()

[`apply(thisArg, [argsArray])`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法可**改变运行函数的上下文**，第一个参数传入"运行函数的上下文"；第二个参数为可选参数，原方法的参数。

``` js
let x = 500;
let obj1 = { x: 100 }
let obj2 = {
  x: 10,
  add(y, z) {
    return this.x + y + z
  }
}
// 也可以传入匿名对象
let a = obj2.add.apply(obj1, [3, 4]);         // a=107
let b = obj2.add.apply({ x: 200 }, [20, 30]); // b=250
// 第一个参数为指定对象时，默认为全局对象
let b = obj2.add.apply(null, [20, 30]);       // b=550
let b = obj2.add.apply(undefined, [20, 30]);  // b=550
```

### call()

[`call(thisArg, arg1, arg2, ...)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 的用法与 `apply()` 基本一致，第一个参数也相同，不同的只是把第二个参数拆开列出。同样是上面的例子，使用 `call()` 如下：

``` js
let a = obj2.add.call(obj1, 3, 4);         // a=107
```

### bind()

[`bind(thisArg[, arg1[, arg2[, ...]]])`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 用于**创建一个新的函数**，在调用时设置 `this` 关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

例子如下：

``` js
let obj1 = { x: 100 }
let obj2 = {
  x: 10,
  add(y, z) {
    return this.x + y + z
  }
}
let fn = obj2.add.bind(obj1, 2);   // fn是一个函数，且设置了第一个参数为2
fn(3);    // 105
```

### Function.prototype.apply.call(func, this, Args)

`Function.prototype.apply.call(func, args)` 用于将任意函数绑定任意参数对象执行。如：

``` js
let obj = { a: 1 }
function fn() {
  console.log(this.a);
}
Function.prototype.apply.call(fn, obj);   // 1
```

要理解该函数并不难，其实类似这种内置对象的**原型对象的方法**都是一样的思路：

默认情况下，我们通过**实例对象**调用该方法（如，`fn.apply()`）。对于 `apply()` 来说， `fn` 就是方法的"调用者"，即 `this` 的指向对象。

当把 `Function.prototype.apply` 作为一个函数整体，则需为其提供 `this` 和 `thisArgs` 。`this` 就是类似于 `fn` 的函数对象； `thisArgs` 就是类似于 `fn.apply()` 的参数。

如果文字表述太无力，请看下面例子：

``` js
let obj = { c: 100 }
function fn(a, b) {
  console.log(a + b + (this.c || 0))
}
// 以下结果都是 103
fn.call(obj, 1, 2);
fn.apply(obj, [1, 2]);
Function.prototype.apply.call(fn, obj, [1, 2]);
Function.prototype.apply.apply(fn, [obj, [1, 2]]);
Function.prototype.call.call(fn, obj, 1, 2);
Function.prototype.call.apply(fn, [obj, 1, 2]);
```


