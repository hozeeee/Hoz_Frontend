
# Proxy 与 Reflect

## Proxy 初步认识

[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 意为"**代理器**"，是 ES6 新增，用于修改目标对象的成员之前进行"**拦截**"，外界对该对象的成员的访问，都必须先通过这层拦截。其中，成员包括未定义的，即访问或设置不存在的属性，也会触发相应的代理函数。

### 创建

通过构造函数可以创建 Proxy 对象（`new Proxy()`），需要依次传入两个参数：

1. **被代理的目标对象**。可以是任意类型的对象，包括数组、函数等，甚至是另一个 Proxy 对象。
2. **控制器对象**。控制器是一个对象，内部定义零个或多个代理函数。若控制器为空对象，等同于直接访问目标对象。

下面给出简单的例子：

``` js
let obj = { a: 1 }
let proxy = new Proxy(obj, {
  get(obj, prop) {
    return 'proxyReturn'
  }
});
console.log(proxy.a);  // 'proxyReturn'
console.log(proxy.b);  // 'proxyReturn'
```

例子中， `proxy` 对 `obj` 对象拦截，访问其属性时，永远返回的是 `'proxyReturn'` ，即使属性是不存在。而 `get` 函数是众多代理函数中的一种，下面会分别介绍其他的代理函数。

### 作为 prototype 的情况

有一种情况， Proxy 对象作为某个对象的原型。看下面例子：

``` js
let proxy = new Proxy({}, {
  get(obj, prop) {
    return 'proxyReturn'
  }
});
let obj = { a: 1 }
Object.setPrototypeOf(obj, proxy);
console.log(obj.a);   // 1
console.log(obj.b);   // 'proxyReturn'
```

当访问 `obj.b` 时，由于 `b` 在 `obj` 对象内不存在，因此会到访问原型是否存在该属性，即访问了 `proxy` 对象，从而触发了代理函数。

### 注意

代理对象必须与被代理的对象具有相同特性（这里说的特性指的是，对象是否冻结，是否密封，是否可扩展），即被代理的对象不能修改，使用代理对象的 `set` 方法也会报错。

再例如，被代理的对象被冻结，get方法不能返回与原值不同的值； `getOwnPropertyDescriptor` 必须返回描述符对象。

总之一句，**被代理对象不能改的，代理对象同样不能改；代理对象的方法的返回值类型必须与被代理对象一致**。

### 控制器对象内方法的 this

控制器对象内方法的 **`this` 指向控制器**对象本身，看如下例子：

``` js
let handler = {
  get() {
    return this
  }
}
let proxy = new Proxy({}, handler);
console.log(proxy.a === handler);   // true
```

</br>

## Proxy 的控制器对象

上面提到，控制器对象可以包含零个或多个的代理函数。

像 `get` 这样的代理函数，一共有 13 个。简单介绍下面出现的参数名意义：

- `target`: 表示**被代理的对象**。
- `propKey`: 表示**属性名**（或方法名）。
- `receiver`: 表示该方法所在的**代理对象**。

### `get(target, propKey, receiver)`

`get` 方法用于**拦截**某个成员的**读取操作**（包括方法），上面已经简单给出了例子。下面给出代理数组的例子，使其可以用负数索引。

``` js
let arr = [1, 2, 3, 4, 5];
let proxy = new Proxy(arr, {
  get(target, prop) {
    let length = target.length,
      index = Number.parseInt(prop);
    if (index < 0) {
      return target[length + index]
    }
    if (index >= length) {
      return target[length - 1]
    }
    return target[index]
  }
});
console.log(proxy[-1]);   // 5
console.log(proxy[10]);   // 5
console.log(proxy[2]);    // 3
```

### `set(target, propKey, value, receiver)`

`set` 方法用于拦截对象属性的设置。其中， `value` 表示属性的目标值。比较实用的用法是，与 DOM 的数据绑定。

需要注意的是！当存在二级属性时，如 `[{}, {}]` 或 `{ a: {}, b: {} }` ，**对二级或以上的属性修改并不会触发 `set` 方法**。

如下例子：

``` js
let listData = ['one', 'two', 'three'];
let proxy = new Proxy(listData, {
  set(target, prop, value) {
    let dom = document.getElementsByClassName('list-item')[prop]
    dom ? dom.innerText = value : null;
    target[prop] = value;
  }
})
proxy[0] = 'changed-one';
```

### `has(target, propKey)`

`has` 方法用来**拦截 `HasProperty` 操作**，即判断对象是否具有某个属性时，这个方法会生效。

典型的操作就是 **`in` 运算符**。

注意， `has​OwnProperty()` 和 `for...in` 都不能触发 `has` 方法。

注意， `has` 方法**只能返回布尔值**， `return` 非布尔值会自动转成布尔值。

``` js
let arr = [1, 2, 3, 4];
let proxyArr = new Proxy(arr, {
  has(target, prop) {
    return 'a'
  }
})
console.log('x' in proxyArr);    // true
```

### `deleteProperty(target, propKey)`

`deleteProperty` 方法用于**拦截 `delete` 操作**，只能返回布尔值，非布尔值会被转成布尔值，代表属性是否被删除成功，省略默认返回 `false` 。

``` js
let obj = { a: 1, b: 2 }
let proxyDel = new Proxy(obj, {
  deleteProperty(target, prop) {
    delete target[prop]
  }
});
console.log(delete proxyDel.a);   // false
console.log(obj);   //  { b: 2 }
```

### `getOwnPropertyDescriptor(target, propKey)`

`getOwnPropertyDescriptor` 方法拦截 `Object.getOwnPropertyDescriptor()` 或 `Object.getOwnPropertyDescriptors()` ，返回一个属性描述对象或者 `undefined` 。

注意，**若返回值不是 `undefined` ，则返回值必须是包含 `[[configurable]]` 为 `true` 的对象**，该值为 `false` 或省略会导致报错；若其他描述符未定义，以默认值填充；若返回对象包含除描述符以外的属性，则该属性被忽略。

``` js
//  undefined
let proxy1 = new Proxy({}, {
  getOwnPropertyDescriptor(target, prop) {
    return undefined
  }
});
console.log(Object.getOwnPropertyDescriptor(proxy1, 'a'));
// { value: undefined, writable: false, enumerable: false, configurable: true }
let proxy2 = new Proxy({}, {
  getOwnPropertyDescriptor(target, prop) {
    return { configurable: true }
  }
});
console.log(Object.getOwnPropertyDescriptor(proxy2, 'a'));
// 报错
let proxy3 = new Proxy({}, {
  getOwnPropertyDescriptor(target, prop) {
    return { configurable: false }
  }
});
console.log(Object.getOwnPropertyDescriptor(proxy3, 'a'));
```

### `defineProperty(target, propKey, propDesc)`

`defineProperty` 方法**拦截** `Object.defineProperty()`、`Object.defineProperties()`、`obj.prop = 'value'` 等**修改/添加**对象的**成员**的操作。

该方法只能返回布尔值，非布尔值会转成布尔值，表示是否成功定义属性，返回 `fasle` 会导致报错。

其中， `propDesc` 表示属性的描述符。

注意，如果对象被冻结（`Object.freeze()`）或对象被密封（`Object.seal()`）或对象不可扩展（`Object.preventExtensions()`），甚至是某个属性被密封（`[[configurable]]`特性为`false`），对代理对象使用 `Object.defineProperty()` 都可能会报错。

总之，和原对象的特性一致，不能被修改的被代理后同样不能被修改。

``` js
let obj = { d: 4 }
let proxyObj = new Proxy(obj, {
  defineProperty() {
    console.log('proxy-defineProperty');
    return true
  }
})
// 以下4种方法都会触发 defineProperty 方法
Object.defineProperty(proxyObj, 'a', {});
Object.defineProperties(proxyObj, { b: {} });
proxyObj.c = 3;
proxyObj.d = 5;
```

### `apply(target, object, args)`

`apply` 方法拦截 **函数的调用、`call`、`apply`、`bind`** 操作。其中， `object` 表示函数上下文对象， `args` 表示函数的参数。

``` js
let obj = { a: 10 }
function fn() { }
let proxyFn = new Proxy(fn, {
  apply(target, object, args) {
    console.log('proxyFn-apply');
  }
})
// 直接执行函数 会触发
proxyFn();
// apply 和 call 会触发
proxyFn.apply(obj);
proxyFn.call(obj);
// bind 定义时不会触发 执行时触发
let p = proxyFn.bind(obj);
p();
```

### `construct(target, args, receiver)`

`construct` 方法用于**拦截 `new` 命令**。

注意，**被代理的函数不能是箭头函数**，否则也会报错。

注意， `construct` 方法**必须要 `return` 对象**（包括函数、数组等），否则会报错。

``` js
// 错误例子1
let P1 = new Proxy(()=>{},{
  construct(){
    return {}
  }
});
let p1 = new P1();    // 报错,被代理函数不能是箭头函数
// 错误例子2
let P2 = new Proxy(function(){},{
  construct(){}
});
let p2 = new P2();    // 报错,construct必须返回对象
```

### `getPrototypeOf(target)`

`getPrototypeOf` 方法主要用来**拦截获取对象原型**，返回值必须是 `null` 或对象。

具体来说，拦截下面这些操作。

- `Object.prototype.__proto__`: 只能在浏览器环境下执行
- `Object.prototype.isPrototypeOf()`: 代理对象作为参数
- `Object.getPrototypeOf()`: 代理对象作为参数
- `Reflect.getPrototypeOf()`: 代理对象作为参数
- `instanceof`: 代理对象在运算符的左边

下面给出简单例子：

``` js
let proxy = new Proxy({},{
  getPrototypeOf(){
    console.log('proxy-getPrototypeOf');
    return null
  }
});
// 都会打印 'proxy-getPrototypeOf'
let x1 = proxy.__proto__;   // 只能在浏览器下执行
let x2 = {}.isPrototypeOf(proxy);
let x3 = Object.getPrototypeOf(proxy);
let x4 = Reflect.getPrototypeOf(proxy);
let x5 = (proxy instanceof function(){});
```

### `setPrototypeOf(target, proto)`

`setPrototypeOf` 方法主要用来**拦截 `Object.setPrototypeOf()` 方法**。和 `Object.setPrototypeOf()` 方法一样，必须返回被设置的对象，否则报错。其中， `proto` 表示被设为原型的对象。

注意，浏览器环境下可以通过 `__proto__` 设置原型对象，同样能触发 `setPrototypeOf` 方法。

``` js
let proxy = new Proxy({}, {
  setPrototypeOf(target, proto) {
    console.log('proxy-setPrototypeOf')
    return target;
  }
});
// 都打印 'proxy-setPrototypeOf'
Object.setPrototypeOf(proxy, {});
proxy.__proto__ = {}  // 非浏览器环境下使用会报错
```

### `isExtensible(target)`

`isExtensible` 方法**拦截 `Object.isExtensible()` 方法**，必须返回布尔值，非布尔值会被转成布尔值，且返回值必须与源对象所对应的值相同，否则报错。

``` js
// 错误示范
let proxy = new Proxy({}, {
  isExtensible() {
    return false
  }
});
console.log(Object.isExtensible(proxy));
```

### `preventExtensions(target)`

`preventExtensions` 方法**拦截 `Object.preventExtensions()` 方法**，只能返回被设为不可扩展的被代理对象，否则报错。如下：

``` js
let proxy = new Proxy({}, {
  preventExtensions(target) {
    console.log('proxy-preventExtensions')
    return Object.preventExtensions(target);
  }
});
Object.preventExtensions(proxy);  // proxy-preventExtensions
// 错误示范
let proxyErr = new Proxy({}, {
  preventExtensions(target) {
    return {}
  }
});
Object.preventExtensions(proxyErr);  // 报错
```

### `ownKeys(target)`

`ownKeys` 方法用来**拦截**对象自身**所有属性的读取**操作，必须返回数组或对象，否则报错。

具体来说，拦截以下操作。

- `Object.getOwnPropertyNames()`
- `Object.getOwnPropertySymbols()`
- `getOwnPropertyDescriptors()`
- `Object.entries()`、`Object.keys()`、`Object.values()`
- `for...in` 循环

注意，虽然可以返回非数组的对象，对于如 `Object.keys` 这种默认返回数组的方法，得到的结果会是一个空数组。

注意，诸如 `Object.entries` 方法返回的数组不会含有 Symbol 属性名、不存在的属性名、不可遍历（enumerable）的属性名，与被代理对象的行为一致。

`Object.getOwnPropertySymbols` 及其他方法同理，与被代理对象一致。

看下面简单例子：

``` js
let proxy = new Proxy({ a: 1, b: 2 }, {
  ownKeys() {
    console.log('proxy-ownKeys');
    return ['a', 'c']
  }
});
// 都会打印 'proxy-ownKeys'
let x1 = Object.entries(proxy);
let x2 = Object.keys(proxy);
let x3 = Object.values(proxy);
for (let x4 in proxy) { }
let x5 = Object.getOwnPropertyNames(proxy);
let x6 = Object.getOwnPropertyDescriptors(proxy);
let x7 = Object.getOwnPropertySymbols(proxy);
// entries、keys、values 都会过滤不可能显示的属性，跟被代理对象一致
console.log(x1);    // [ [ 'a', 1 ] ]
```

</br>

## `Proxy.revocable()`

`Proxy.revocable()` 方法与 `new Proxy()` 用法类似，都是依次传入被代理对象和控制器对象，**返回一个包含 `proxy` 对象和 `revoke` 方法的对象**。

其中， `proxy` 对象和上面描述的一致， `revoke` 方法用于解除 `proxy` 对象的代理，一旦取消将无法继续使用。

``` js
let proxyR = Proxy.revocable({ a: 1 }, {});
console.dir(proxyR);        // { proxy: { a: 1 }, revoke: [Function] }
console.log(proxyR.proxy);  // { a: 1 }
proxyR.revoke();
// console.log(proxyR);  // 报错
```

</br>

## Reflect 对象

Reflect对象也是 ES6 新增的，意为"**映射**"，表示把其他内置对象中常用的方法映射到 Reflect 对象上。

所以只有静态方法。 Reflect 对象的设计目的有这样几个：

- **将 Object 对象的一些明显属于语言内部的方法放到 Reflect 对象上**。
  - 现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。
  - 也就是说，从 Reflect 对象上可以拿到语言内部的方法。

- **修改某些 Object 方法的返回结果，让其变得更合理**。
  - 比如， `Object.defineProperty(obj, name, desc)` 在无法定义属性时，会抛出一个错误，
  - 而 `Reflect.defineProperty(obj, name, desc)` 则会返回 `false` 。

- **让 Object 操作都变成函数行为**。
  - 某些 Object 操作是命令式，比如 `name in obj` 和 `delete obj[name]` ，
  - 而 `Reflect.has(obj, name)` 和 `Reflect.deleteProperty(obj, name)` 让它们变成了函数行为。

- **Reflect 对象的方法与 Proxy 对象的方法一一对应**，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。
  - 这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。
  - 也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

以上摘自[阮一峰的《ES6入门》](es6.ruanyifeng.com/#docs/reflect)。

### 静态方法

Reflect 的静态方法与 Proxy 的控制器方法一一对应，甚至连传参都是一致的，目前同样是 13 个，下面简单列出方法及其对应的"旧"方法。

- `Reflect.get(target, name, receiver)`: 对应获取属性值。
  - 如 `obj.a` ，不存在则返回 `undefined` 。
  - 这里需要注意第三个参数 `receiver` ，若获取的属性是 `getter` ，那么 `getter` 的 `this` 会指向 `receiver`对象。

- `Reflect.set(target, name, value, receiver)`: 对应设置属性值。
  - 如 `obj.a = 'value'` 。
  - `receiver` 对象同样影响 `setter` 的 `this` 指向。

- `Reflect.has(obj, name)`: 对应 `in` 运算符。
  - 如 `'a' in obj` 。

- `Reflect.deleteProperty(obj, name)`: 对应 `delete` 运算符。
  - 如 `delete obj.a` 。
  - 方法返回布尔值，若删除成功或被删除的属性不存在，返回 `true` ；
  - 删除失败，即被删除的属性依然存在（`[[configurable]] = false`），返回 `false` 。

- `Reflect.construct(target, args)`: 对应 `new` 运算符。
  - 如 `new Fn(...args)` 。

- `Reflect.getPrototypeOf(obj)`: 对应 `Object.getPrototypeOf()` 。
  - 两者差别在于当参数为非对象时， `Object.getPrototypeOf()` 会被"包装"成对象后传入；
  - 而 `Reflect.getPrototypeOf()` 会报错。

- `Reflect.setPrototypeOf(obj, newProto)`: 对应 `Object.setPrototypeOf()` 。
  - 方法返回布尔值，表示是否设置成功。

- `Reflect.apply(func, thisArg, args)`: 对应 `Function.prototype.apply.call()` 。

- `Reflect.defineProperty(target, propKey, attributes)`: 对应 `Object.defineProperty()` 。
  - 方法返回布尔值，表示是否定义成功。

- `Reflect.getOwnPropertyDescriptor(target, propKey)`: 对应 `Object.getOwnPropertyDescriptor()` 。

- `Reflect.isExtensible(target)`: 对应 `Object.isExtensible()` 。

- `Reflect.preventExtensions(target)`: 对应 `Object.preventExtensions()` 。

- `Reflect.ownKeys(target)`: 对应 `Object.getOwnPropertyNames()` 与 `Object.getOwnPropertySymbols()` 。
