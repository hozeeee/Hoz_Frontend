
# Symbol

[`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 类型是 ES6 引入的一种数据类型，表示独一无二的值，是 JavaScript 语言的第七种数据类型。

目前我所了解的两个用途：

- 作为属性名或变量名，避免重名带来的问题；
- 作为内置对象的特定方法的属性名，方便开发者对其改写。

</br>

## Symbol 值的创建

Symbol 值创建的方法有两种，下面逐一介绍。

### `Symbol()` 函数

Symbol 值能通过 `Symbol` 函数生成，要注意的是， `Symbol` 类型没有构造函数，即**使用 `new Symbol()` 会报错**。**此方法创建的 Symbol 值永远 不会有相等的**。

``` js
let s1 = Symbol();
// let s = new Symbol();    // 错误例子
// 可以传入字符串作为参数
let s2 = Symbol('foo');
// 即使传入相同的字符串，得到的两个值仍然是不相等的
console.log(Symbol('foo') === Symbol('foo'));    // false
// 通过 toString() 方法可以获取该值的字符串量
console.log(s2.toString());     // 'Symbol(foo)'
// 通过实例属性 description 可以获取描述的字符串量
console.log(s2.description);    // 'foo'
```

如例子中的 `s2` 所示， **`Symbol()` 能传入字符串值作为描述**，且仅能作为描述，即使是传入相同的描述字符串，得到的值仍然不相等。

### `Symbol.for()` 函数

使用 `Symbol.for()` 方法可以得到一个"可能相同"的 `Symbol` 值，**接受一个字符串作为参数**（该值作为 `key` ，通过 `keyFor()` 方法可以获取该值），然后搜索有没有以该参数作为名称的 `Symbol` 值。

如果有，就返回这个 `Symbol` 值，否则就新建并返回一个以该字符串为名称的 `Symbol` 值。

看如下例子：

``` js
let s1 = Symbol.for('baz');
let s2 = Symbol.for('baz');
console.log(s1 === s2);    // true
// 获取 key 值
console.log(s1.keyFor());  // 'baz'
```

</br>

## Symbol 作为属性名的注意事项

### 遍历方法中的 Symbol 属性值

使用 Symbol 作为属性名时，该属性不会出现在 `for...in` 循环中、`Object.entries()`、`Object.keys()`、`Object.values()`（其对应的属性值）、`Object.getOwnPropertyNames()`、`JSON.stringify()` 的返回。

但它也不是私有属性。

有两个方法可以获取到有关 Symbol 值的属性: `Object.getOwnPropertySymbols` 方法，可以获取指定对象的所有 Symbol 属性名（Symbol 类型的值，非字符串量）；以及扩展运算符（`...`）。

下面是测试的结果：

``` js
let obj = {
  [Symbol()]: 'symbol',
  a: 1
}
// 【for...in】
for(let i in obj){
  console.log(i);                 // a  (只有a)
}
// 【Object.entries】
let entries = Object.entries(obj);
console.log(entries);             // [ [ 'a', 1 ] ]
// 【Object.values】
let values = Object.values(obj);
console.log(values);              // [ 1 ]
// 【Object.keys】
let keys = Object.keys(obj);
console.log(keys);                // [ 'a' ]
// 【Object.getOwnPropertyNames】
let ownPropNames = Object.getOwnPropertyNames(obj);
console.log(ownPropNames);        // [ 'a' ]
// 【JSON.stringify】
console.log(JSON.stringify(obj)); // {"a":1}

// 【Object.getOwnPropertySymbols】
let ownPropSymbols = Object.getOwnPropertySymbols(obj);
console.log(ownPropSymbols);  // [ Symbol() ]
// 【展开运算符(...)】
let obj2 = {...obj}
console.log(obj2);            // { a: 1, [Symbol()]: 'symbol' }
```

### 只能使用`[]`运算符

以 Symbol 值作为属性名，必须使用 `[]` 运算符定义和获取属性值。例子如下：

``` js
let mySymbol = Symbol('foo');
let obj = {
  [mySymbol]: 'Symbol',
  mySymbol: 'string'
}
console.log(obj.mySymbol);    // string
console.log(obj[mySymbol]);   // Symbol
console.log(obj['mySymbol']); // string
```

</br>

## 内置的 Symbol 值

ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法，当开发者需要修改指定的原生方法时会用到。下面简单列举，具体请查阅 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 。

### `Symbol.hasInstance`

对象的 `Symbol.hasInstance` 属性，指向一个内部方法。当其他对象使用 `instanceof` 运算符，判断是否为该对象的实例时，会调用这个方法。

### `Symbol.isConcatSpreadable`

对象的 `Symbol.isConcatSpreadable` 属性等于布尔值，表示该对象用于 `Array.prototype.concat()` 时，是否可以展开。

### `Symbol.species`

对象的 `Symbol.species` 属性，指向一个构造函数。创建衍生对象时，会使用该属性。

### `Symbol.match`

对象的 `Symbol.match` 属性，指向一个函数。当执行 `str.match(myObject)` 时，如果该属性存在，会调用它，返回该方法的返回值。

### `Symbol.replace`

对象的 `Symbol.replace` 属性，指向一个方法，当该对象被 `String.prototype.replace` 方法调用时，会返回该方法的返回值。

### `Symbol.search`

对象的 `Symbol.search` 属性，指向一个方法，当该对象被 `String.prototype.search` 方法调用时，会返回该方法的返回值。

### `Symbol.split`

对象的 `Symbol.split` 属性，指向一个方法，当该对象被 `String.prototype.split` 方法调用时，会返回该方法的返回值。

### `Symbol.iterator`

对象的 `Symbol.iterator` 属性，指向该对象的默认遍历器方法。

### `Symbol.toPrimitive`

对象的 `Symbol.toPrimitive` 属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

### `Symbol.toStringTag`

对象的 `Symbol.toStringTag` 属性，指向一个方法。在该对象上面调用 `Object.prototype.toString` 方法时，如果这个属性存在，它的返回值会出现在 `toString` 方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制 `[object Object]` 或 `[object Array]` 中 `object` 后面的那个字符串。

### `Symbol.unscopables`

对象的 `Symbol.unscopables` 属性，指向一个对象。该对象指定了使用 `with` 关键字时，哪些属性会被 `with` 环境排除。




