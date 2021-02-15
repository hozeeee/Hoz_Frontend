
# Set 对象 和 Map 对象

## Set

ES6 提供了新的数据结构 [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 。

它类似于数组，但是**成员的值都是唯一的**，没有重复的值。 使用 `new Set()` 创建一个 Set 对象，对象的**成员可以是任意类型**。

### 创建 Set 实例

``` js
// 创建一个空的Set对象
let s1 = new Set();                   // Set(0) {}
// 传入数组，或类数组
let s2 = new Set([1, 2, 2, 3, 5]);    // Set(4) {1, 2, 3, 5}
```

### Set对象的属性/方法

以下例子均以 `let s = new Set([1, 'a', {}]);` 为前提。

- `add(value)`：为对象**添加成员**，已有该成员则不添加。方法返回对象本身。

  ``` js
  s.add('b');    // Set(4) {1, "a", {…}, "b"}
  s.add('a');    // Set(4) {1, "a", {…}, "b"}
  ```

- `clear()`：**清除所有成员**。

  ``` js
  s.clear();    // s = Set(0) { }
  ```

- `delete(value)`：**删除指定对象**。删除成功则返回 `true` ，否则返回 `false` 。

  ``` js
  s.delete(1);    // true，删除成功
  s.delete(1);    // false，值不存在无法删除
  ```

- `has(value)`：**判断对象内是否含有该值**。布尔值。

  ``` js
  s.has(1);     // true
  s.has({});    // false  与对象内的"{}"并非同一个对象
  ```

- `values()`：**返回一个新生成的可迭代对象**，其顺序与插入 Set 对象时的顺序相同。

  ``` js
  let sIterator = s.values();    // 迭代器
  let value1 = sIterator.next().value;    // value1 = 1 
  let value2 = sIterator.next().value;    // value2 = 'a'
  ```

- `keys()`：与 `values()` 方法的返回结果一致。

- **`forEach(callback[, thisArg])`**：按顺序都执行提供的 `callback` 函数一次。值得注意的是， Set 对象的只有"值"，可以理解为**键值相等**，所以 `callback` 的第一第二个参数是一致的。

  ``` js
  // callback函数的三个参数和数组遍历类似：值、值、对象本身
  s.forEach((key, value, set) => {
    // 打印每个值
    console.log(value);
  });
  // 1 'a' {}
  ```

- `entries()`：返回一个新的包含 `[value, value]` 形式的数组**迭代器对象**，顺序与上面个的方法一致。

  ``` js
  let sIterator = s.entries();    // 迭代器
  let value1 = sIterator.next().value;    // value1 = [1, 1]
  let value2 = sIterator.next().value;    // value2 = ['a', 'a']
  ```

- `size`：属性，会返回 Set 对象中**元素的个数**。

  ``` js
  let size = s.size;    // size = 3
  ```

### 常见用途

1. 合并数组并除去相同项：

    ``` js
    let arr1 = [1, 3, 'a'],
      arr2 = [2, 3, 'a', 'b'];
    let s = new Set([...arr1, ...arr2]);
    let concatArr = [...s];    // concatArr = [1, 3, "a", 2, "b"]
    ```

2. 将 Set 对象转化成数组对象：

    ``` js
    let s = new Set([1, 2, 3]);
    let arr = Array.from(s);    // arr = [1, 2, 3]
    ```

</br>

## WeakSet

[WeakSet](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 对象允许你**将弱保持对象存储在一个集合中**。WeakSet 结构与 Set 类似，也是不重复的值的集合。

但是，它与 Set 有三个**区别**：

- WeakSet 的**成员只能是对象**，而不能是其他类型的值。
- WeakSet 中的**成员都是弱引用**，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，**如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中**。
- WeakSet 对象**不能遍历**，所以 `keys()` 、 `values()` 、 `entries()` 、 `forEach()` 、 `clear()` 、 `size` 这些属性方法都没有。

</br>

## Map

[Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 对象保存**键值对**，**键/值可以是任意类型**。

### 创建 Map 实例

``` js
// 创建一个空的Map对象
let m1 = new Map();
// 传入[key，value]数组
let m2 = new Map([['a', 'b'], ['c', 'd']]);    // Map(2) {"a" => "b", "c" => "d"}
```

### Map对象的属性/方法

Map 对象和 Set 对象的数据格式很像，大多数的属性方法都一致，诸如 `clear()` 、 `delete()` 、 `has()` 、 `keys()` 、 `values()` 、 `entries()` 、 `forEach()` 、 `size` 。有两个方法是 Map 对象特有的：

- `get(key)`：返回一个 Map 对象中与指定键相关联的值，找不到则返回 `undefined` 。

  ``` js
  let m = new Map([['a', 'b'], ['c', 'd']]);
  m.get('a');    // 'b'
  m.get('e');    // undefined
  ```

- `set(key, value)`：为 Map 对象添加或更新一个指定的键值对。返回对象本身，所以**可以使用链式操作**，如 `myMap.set(k1,v1).set(k2,v2)` 。值得注意的是，Map 对象的键的比较是基于 "SameValueZero" 算法，诸如 `NaN` 、 `Infinite` 等会被看成同一个值。

  ``` js
  let m = new Map();   // Map(0) { }
  m.set(1, 2);         // Map(1) {1 => 2}
  m.set(1, 'a');       // Map(1) {1 => 'a'}
  m.set(Infinity, 3).set(NaN, 4);    // Map(3) {1 => 'a', NaN => 4, Infinity => 3}
  m.set(Infinity, 30).set(NaN, 40);  // Map(3) {1 => 'a', NaN => 40, Infinity => 30}
  ```

### 配合展开运算符(`...`)使用

``` js
let m = new Map([['a', 'b'], ['c', 'd']])
// 获取所有的"键"组成数组
let keys = [...m.keys()];        // ['a', 'c']
// 获取所有的"值"组成数组
let values = [...m.values()];    // ['b', 'd']
```

</br>

## WeakMap

和 WeakSet 类似， [WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 对象是一组键/值对的集合，其中的键是**弱引用**的。其键必须是对象，而**值可以是任意类型的**，**不能遍历**，所以没有 `keys()` 、 `values()` 、 `entries()` 、 `forEach()` 、 `clear()` 、 `size` 。拥有与 Map 相同非遍历的方法，如 `get()` 、 `set()` 、 `has()` 、 `delete()` ，具体用法相同，不多介绍。

WeakMap 应用的**典型场合就是以 DOM 节点作为键名，事件处理函数作为值**。当 DOM 节点被删除时，该节点的事件处理函数也能被正确地垃圾回收。

``` js
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();
// 存放DOM节点的弱引用，和事件处理函数需要的参数
myWeakmap.set(myElement, {timesClicked: 0});
// 添加事件
myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```

WeakMap 的另一个用处是**部署私有属性**。

``` js
// 两个私有变量的存放
const _counter = new WeakMap();
const _action = new WeakMap();
// 创建"类"
class Countdown {
  constructor(counter, action) {
    // 以实例自身为"键"，私有变量为"值"存放
    _counter.set(this, counter);
    _action.set(this, action);
  }
  // 访问自由私有变量的方法
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}
// 测试实例
const c = new Countdown(2, () => console.log('DONE'));
c.dec()
```
