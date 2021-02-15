
# Object

## 创建 Object 实例

Ojbect 的实例称之为对象，对象内的有属性和方法。

创建对象实例的方法有 5 种：

``` js
// 语法糖创建
let obj1 = { a: 1 }
// Object 构造函数创建 空对象
let obj2 = new Object()
obj2.a = 1;
// 自定义构造函数 创建对象
function Creater() {
  this.a = 1
}
let obj3 = new Creater()
// 通过复制一个或多个对象来创建一个新的对象
let obj4 = Object.assign({}, obj1);
// 使用指定的原型对象和属性创建一个新对象
// 注意，obj5为空对象，但可以通过原型链访问到obj1的属性
let obj5 = Object.create(obj1);
```

其中，`obj3`/`obj5` 都与原型链有关。[更多关于原型链](./原型链.md)。下面简单介绍 `Object.assign()` 和 `Object.create()` ：

- [`Object.assign(target, ...source)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)：通过复制一个或多个对象来创建一个新的对象。

  `target`：目标对象，`source`：源对象；返回值：目标对象。其中有两点需要注意：

  - **目标对象会被改变**；
  - 此方法属于**浅拷贝**；

- [`Object.create(proto, [propertiesObject])`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)：使用指定的原型对象和属性创建一个新对象。

  `proto`：是新创建对象的原型对象；`propertiesObject`：可选，新对象的属性的特性；返回值：一个继承原型对象的新对象。

</br>

## 对象的属性

### 添加 与 删除 属性

添加或删除属性，均有两种方法："点" 和 "大括号" 。如下为示例代码：

``` js
let person = { name: 'zhangsan' }
// 通过.操作符为对象添加属性
person.age = 20;           // { name: 'zhangsan', age: 20 }
// 通过[]操作符为对象添加属性
person["weight"] = 100;    // { name: 'zhangsan', age: 20, weight: 100 }
// 删除属性，同样可以使用.操作和[]操作
delete person.weight;
delete person["age"];
```

### 检测属性是否属于某对象

对象的属性可以分为两种：自身的、继承于原型的。

假设有以下两个对象：

``` js
// son 继承自 obj ，且 son 上有属性 b ，而 parent 上有属性 a
let parent = { a: 1 }
let son = Object.create(parent);
son.b = 2;
```

- **`in`** 操作符，检测指定**对象及其原型链**上是否有该属性。

``` js
console.log('a' in son); // true
console.log('b' in son); // true
console.log('c' in son); // false
```

- 实例对象上的 **`hasOwnProperty()`** 方法，检测是否含有某个**私有属性**。

``` js
console.log(son.hasOwnProperty('a')); // false
console.log(son.hasOwnProperty('b')); // true
```

### 遍历

当我们需要对对象内所有属性作相同操作，或获取对象内所有属性，则需要遍历实现。遍历同样面临两个问题：只是遍历对象自身属性，还是及其原型链上的属性。

同样是先给定示例对象：

``` js
let parent = { a: 1, b: 2 }
let son = Object.create(parent);
son.x = 10;
son.y = 20;
```

- [**`Object.keys(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)：返回一个包含所有给定**对象自身可枚举属性**名称的数组。

``` js
// 只返回对象自身的属性的键名的集合
console.log(Object.keys(son)); // [ 'x', 'y' ]
```

还有与 `Object.keys(obj)` 对应的方法： `Object.values()` ，不同的是 `Object.values()` 返回属性值集合。

- **`for-in`** 运算符：遍历给定**对象自身及其原型链上可枚举属性**名称的数组

``` js
// 获取对象及其原型链上的属性的键名
for(let prop in son){
  console.log(prop)
}
// x
// y
// a
// b
```

- [**`Object.entries()`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)：返回给定**对象自身可枚举属性**的 `[key, value]` 数组。

``` js
console.log(Object.entries(son)); // [ [ 'x', 10 ], [ 'y', 20 ] ]
```

这种数据结构很方便的构造一个 **`Map`** 对象，关于 `Map` 对象请点击[查看更多](./Set对象和Map对象.md#Map)。

</br>

## 深拷贝

由于 JavaScript 中的对象是引用类型，意味着直接赋值只能得到对象的指针，而并非创新一个新的对象副本。这情况会导致任意引用修改对象的值，其他引用也会发生变化。

上面提到的 `Object.assign()` 是浅拷贝，下面示例代码：

``` js
let obj = { a: 1, b: { x: 1, y: 2 } }
// 浅克隆
let objClone = Object.assign(obj);
// objClone.b 对象的修改会导致 obj.b 对象也发生变化，因为两者引用同一个对象
objClone.b.x = 100;
console.log(obj.b.x); // 100
```

### 自定义深拷贝函数

下面函数原理是遍历对象内所有属性，遇到属性的类型为对象这重复调用该函数。

``` js
function deepCopy( source ) {
    let target = Array.isArray( source ) ? [] : {}
    for ( var k in source ) {
        if ( typeof source[ k ] === 'object' ) {
            target[ k ] = deepCopy( source[ k ] )
        } else {
            target[ k ] = source[ k ]
        }
    }
    return target
}
```

### 利用 "JSON" 对象的内置方法深拷贝

要注意的是，本方法有局限性，仅使用属性为数据属性。如下：

``` js
let obj = {
  _a: 1,
  b: {
    x() { console.log(1) },
    y: function () { console.log('y') },
    _z: 100,
    get z() { return this._z },
    set z(val) { this._z = val }
  }
}
// 添加访问器属性
Object.defineProperty(obj, 'a', {
  get: function () { return this._a },
  set(val) { this._a = val }
})
// 使用 JSON 内置方法的骚操作
let objClone = JSON.parse(JSON.stringify(obj));
console.log(objClone);  // { _a: 2, b: { _z: 100, z: 100 } }
```

以上代码可以看出：方法、访问器属性、 `setter` 都会被忽略，而 `getter` 有点特别，先获取值后变成数据属性。

</br>

## 属性的特性

特性表示该属性的权限，如被读、被改写、被删除、被枚举。

### 数据属性有 4 个特性

- `[[configurable]]`：能否通过 **`delete` 运算符删除**属性，缺省为 `false` ；
- `[[enumerable]]`：能否通过 **`for-in` 循环**返回属性，缺省为 `false` ；
- `[[writable]]`：能否**修改**属性的值，缺省为 `false` ；
- `[[value]]`：属性的**值**，缺省为 `undefined` 。

要修改数据属性的特性，必须使用 ES5 的 **`Object.defineProperty()`** 方法。

[**`Object.defineProperty(obj, prop, descriptor)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)：

`obj`：被操作的对象；`prop`：被操作的属性名，存在则修改，不存在则添加；`descriptor`：包含特性的描述符对象。如下是一个简单例子：

``` js
let obj = { a: 1, b: 2 }
// 添加属性"c"，给定值为4，标记为不能修改
Object.defineProperty(obj, 'c', {
  value: 4,
  writable: false
})
```

### 访问器属性同样有 4 个特性

- `[[configurable]]`：能否通过 **`delete` 运算符删除**属性，缺省为 `false` ；
- `[[enumerable]]`：能否通过 **`for-in` 循环**返回属性，缺省为 `false` ；
- `[[get]]`：属性被调用时触发的函数，函数返回值为属性值，缺省为 `undefined` ；
- `[[set]]`：属性被修改时触发的函数，函数的唯一参数为被修改的值，缺省为 `undefined` 。

修改访问器属性的特性，同样使用 **`Object.defineProperty()`** 方法。使用方法不赘述。

创建访问器的**语法糖**：

``` js
let obj = {
  _a: 1,
  get a() {
    return this._a
  },
  set a(val) {
    this._a = val
  }
}
```

### 批量添加数据属性或访问器属性

[**`Object.defineProperties(obj, props)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)：是 `defineProperty` 方法的批量操作。下面给出简单例子：

``` js
let obj = {};
Object.defineProperties(obj, {
  'prop': {
    value: 1,
    writable: true
  },
  'getProp': {
    get: function () {
      return this.prop
    },
    set: function (val) {
      this.prop = val
    }
  }
});
```

### 获取属性的特性

[**`Object.getOwnPropertyDescriptor(obj, prop)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)：获取指定属性的描述符。

`obj`：目标对象；`prop`：目标属性；属性存在，则返回描述符对象，否则为 `undefined` 。

简单示例：

``` js
let obj = { bar: 42 };
let d = Object.getOwnPropertyDescriptor(obj, "bar");
console.log(d);    // { value: 42, writable: true, enumerable: true, configurable: true }
```

</br>

## 对象的防篡改

由于对象是引用类型数据，所以对象可能在某个被引用的地方修改，造成不可预计的问题发生。有以下几种防篡改的模式，但要注意，一旦定义为防篡改，则无法撤销。

### 不可扩展对象

定义：**不能**向对象**添加新的**属性和方法。

方法： [**`Object.preventExtensions(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)，传入被操作对象，返回该对象。

简单示例：

``` js
let obj = { a: 1 }
Object.preventExtensions(obj);
obj.b = 2;  // 严格模式下报错
console.log(obj.b);   // undefined
```

判断对象是否可扩展：[**`Object.isExtensible(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)，传入被操作对象，返回布尔值。

### 密封对象

定义：**不可扩展**，且已有属性的 `[[configurable]]` 特性被改为 `false` ，即所有**成员均不能被删除**。

方法： [**`Object.seal(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)，传入被操作对象，返回该对象。

简单示例：

``` js
let obj = { a: 1 }
Object.seal(obj);
delete obj.a;   // 严格模式下会报错
obj.a = 2;    // 属性可修改
console.log(obj.a);   // 2  
```

判断对象是否密封： [**`Object.isSealed(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed) ，传入被操作对象，返回布尔值。

### 冻结对象

定义： **密封**，且已有属性的 `[[writable]]` 特性被改为 `false` ，即所有**成员均不能被修改**。

方法： [**`Object.freeze(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) ，传入被操作对象，返回该对象。

简单示例：

``` js
let obj = { a: 1 }
Object.freeze(obj);
obj.a = 2;    // 严格模式下会报错
console.log(obj.a);   // 1
```

判断对象是否冻结： [**`Object.isFrozen(obj)`**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen) ，传入被操作对象，返回布尔值。
