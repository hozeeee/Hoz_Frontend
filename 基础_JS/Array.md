
# Array



JavaScript 的 `Array` 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。

## 基本操作

### 创建

数组内存放的可以是任意类型的数据。

``` js
let arr1 = [1, { a: 1 }, 'b', [22, 11], true];
let arr2 = new Array(1, { a: 1 }, 'b', [22, 11], true);
let arr3 = Array(1, { a: 1 }, 'b', [22, 11], true);

// 创建指定长度的空数组
let arr4 = new Array(3);    // 长度为3的空数组  [ <3 empty slots> ]
let arr4 = Array(3);    // 效果同上
```

### 获取和修改成员

获取数组成员的方式: `[]` 运算。

``` js
let arr = [1, { a: 1 }, 'b', [22, 11], true];
console.log(arr[1]);    // { a: 1 }
arr[0] = 100;
console.log(arr);       // [100, { a: 1 }, 'b', [22, 11], true]
```

### 引用类型

Object 是 `Array` 的基类，和 `Object` 一样，数组也是 **引用类型** 的数据。所以简单的赋值并不能复制数组，只是单纯的把"指针"复制给新的变量。看如下例子：

``` js
let arr = [1, 2, 3];
let arr2 = arr;
arr2[1] = 200;
console.log(arr);    // [ 1, 200, 3 ]
```

可以看出， `arr2` 的修改也会对 `arr` 造成影响，其原因是两者指向是同一个对象。要想两者互不影响，必须使用"深拷贝"。（看[另一篇文章](./Object.md#深拷贝)讲述深拷贝）

### 成员的增减

添加/删除数组成员的方法有几个，可以从任意位置操作任意多个的成员，且都会改变数组的长度。下面介绍最简单的从数组尾部添加/删除。

``` js
let arr = [1, 2, 3];
arr.pop();
console.log(arr);    // [ 1, 2 ]
arr.push(100);
console.log(arr);    // [ 1, 2, 100 ]
```

还有一种"特别的"删除成员方法，就是使用 `delete` 运算符，但不会改变数组长度，只会把成员变为"空"：

``` js
let arr = [1, 2, 3];
delete arr[0];
console.log(arr);    // [ <1 empty slot>, 2, 3 ]
```

</br>

## 实例属性

目前常用的属性就一个: [`length`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/length) 。用于获取**数组的长度**。

</br>

## 实例方法

这些方法都是对数组的增删改查。其中"增"、"删"、"改"都会改变原数组。

### 增

- `push(el1[, el2[, ...[, elN]]])`: 将一个或多个元素**添加到**数组的**末尾**，并返回该数组的新长度。

- `unshift(el1[, el2[, ...[, elN]]])`: 将一个或多个元素**添加到**数组**的开头**，并返回该数组的新长度。

- `fill(value[, start[, end]])`: 用一个**固定值填充**一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

``` js
// 【fill】
let arr2 = Array(3).fill('a');
console.log(arr2);  // [ 'a', 'a', 'a' ]
```

### 删

- `pop()`: 从数组中删除**最后一个**元素，并返回该元素的值。

- `shift()`: 从数组中删除**第一个**元素，并返回该元素的值。

### 改

- `copyWithin(target[, start[, end]])`: 参数都是索引值。**浅复制数组的一部分到同一数组中的另一个位置**，并返回它，原数组长度不变。

- `splice(start[, deleteCount[, item1[, item2[, ...]]]])`: **删除或替换**现有元素**或者**原地**添加**新的元素来修改数组，并以数组形式**返回被修改的内容**。
  - `start` ​表示修改开始的索引值，负数表示末尾开始；
  - `deleteCount` 表示移除的个数，可选，非负整数，超出边界取边界值；
  - `item1, item2, ...` 表示要添加的元素，省略则只删除。

- `reverse()`: 把数组**顺序颠倒**，并返回该数组。

- `sort([compareFunction])`: 以指定的算法对数组**排序**。
  - `compareFunction` 表示规定排序规则的函数，接收两个参数:
    - `currentEl` 当前元素，
    - `nextEl` 下一个元素。
  - `compareFunction` 的返回值:
    - 返回 `-1` 表示 `currentEl < nextEl` ；
    - 返回 `0` 表示 `currentEl = nextEl` ；
    - 返回 `1` 表示 `currentEl < nextEl` 。

``` js
// 【sort】
let arr = [ 'b', 'a', 4, 3, 2, 1 ]
arr.sort((a, b) => {
  return a - b
})
console.log(arr);   // [ 'b', 'a', 1, 2, 3, 4 ]
```

### 查

- `indexOf(searchElement[, fromIndex])`: 返回在数组中可以找到一个**给定元素的第一个索引值**，如果不存在，则返回 `-1` 。
  - `searchElement` 表示要查找的元素；
  - `fromIndex` 表示开始查找的索引值，可以为负数，表示从末尾开始。

- `lastIndexOf(searchElement[, fromIndex])`: 和 `indexOf()` 类似，只是从末尾开始，不多介绍。

### 遍历

正常情况下，遍历都**不会修改原数组**，除非你利用索引值对原数组进行修改。

`callback` 表示回调函数，该回调函数可传入三个参数，分别是:

- 当前值 `value` ；
- 当前索引值 `index` ；
- 调用该方法的整个数组 `array` 。

`thisArg` 则表示执行 `callback` 时作为 `this` 对象的值。

- `find(callback[, thisArg])`: 返回数组中**满足 `callback` 函数的第一个元素**的值。否则返回 `undefined` 。

- `findIndex(callback[, thisArg])`: 与 `find()` 类似，只是返回的是**索引值**。如果不存在，则返回 `-1` 。

- `filter(callback[, thisArg])`: 以 `callback` 为条件**过滤数组**。
  - 即对数组每个元素执行一次 `callback` ，返回以 `callback` 返回值为 `true` 的元素组成的**新数组**，所有元素的 `callback` 都是 `false` 则返回 `[]` 。

- `forEach(callback[, thisArg])`: 对数组的**每个元素执行一次 `callback` 函数**，**无返回值**。

- `map(callback[, thisArg])`: 对每个元素执行 `callback` 函数，**返回以 `callback` 的返回值所组成的新数组**。

- `reduce(callback[, initialValue])`: 以 `callback` 函数每次返回的值进行特定的运算，直到把数组所有元素 **"累积"成一个值** 。
  - 和上面的方法不一样， `callback` 接收的参数有四个:
    - `accumulator` 表示上一次调用回调时返回的累积值，初始值等于 `initialValue；currentValue` 表示正在处理的元素；
    - `currentIndex` 表示正在处理的元素的索引值，可选；
    - `array` 表示调用该方法的数组。 `initialValue` 表示计算的初始值，可选。

- `reduceRight(callback[, initialValue])`: 与 `reduce()` 类似，只是从右边开始，不多介绍。

``` js
let arr = [1, 2, 3, 4, 5];
// 【filter】
let result1 = arr.filter(value => {
  return value > 2
});
console.log(result1);    // [ 3, 4, 5 ]
// 【reduce】
let result2 = arr.reduce((sum, current) => {
  return sum += current
}, 15);
console.log(result2);    // 30
```

### 测试

**返回**的结果都是**布尔值**，表示是否含有特定值或满足特定的条件。 `callback` 函数接受的参数参照上面的"遍历"。

- `every(callback[, thisArg])`: 测试一个数组内的所有元素**是否都能通过** `callback` 函数的测试。

- `some(callback[, thisArg])`: 测试一个数组内的所有元素**是否有其中一个通过** `callback` 函数的测试。

- `includes(valueToFind[, fromIndex])`: 查找数组**是否包含指定元素**。
  - `valueToFind` 表示要查找的元素，
  - `fromIndex` 表示开始查找的索引值，默认为 `0` ，可以为负数，表示从末尾开始。

``` js
// 【every】
let arr = [1, 2, 3, 4];
let result = arr.every((value) => {
  return value > 1
});
console.log(result);    // false
```

### 迭代器

- `entries()`: 返回一个新的 `Array Iterator` 对象，该对象包含数组中每个索引的键/值对。

- `keys()`: 返回一个新的 `Array Iterator` 对象，该对象包含数组中每个索引值。（对于数组，该方法实用性不大）

- `value()`: 返回一个新的 `Array Iterator` 对象，该对象包含数组中每个值。

``` js
// 【entries】
let arr = ['a', 'b', 'c'];
let iterator1 = array1.entries();
console.log(iterator1.next().value);    // [0, "a"]
console.log(iterator1.next().value);    // [1, "b"]
```

### 浅拷贝

以下方法都是返回新数组，**不会改变原数组**。

- `concat(value1[, value2[, ...[, valueN]]])`: **合并**两个或多个**数组**组成新数组，返回新数组。
  - `valueN` 表示将数组和/或值连接成新数组。

- `slice(begin, end)`: **提取数组**，从索引 `begin` 到 `end`(不包括`end`)的浅拷贝到一个新数组，返回新数组。
  - `begin` 和 `end` 都是索引值，都可以是负数，表示从末尾开始，若值超过数组边界，取边界值。

- `flat(depth)`: `depth` 指定要提取嵌套数组的结构深度，默认值为 `1` 。
  - 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
  - 简单说就是**把多维数组平铺**，返回新数组，原数组不变。

``` js
// 【concat】
let arr = [1, 2, 3, 4];
let newArr = arr.concat([11, 22], 33);
console.log(newArr);    // [ 1, 2, 3, 4, 11, 22, 33 ]
// 【flat】
let arr = [1, [2, 3], [4, [5, 6], 7], 8]
let result4 = arr.flat(1);
let result5 = arr.flat(2);
console.log(result4);    // [ 1, 2, 3, 4, [5, 6], 7, 8 ]
console.log(result5);    // [ 1, 2, 3, 4, 5, 6, 7, 8 ]
```

### 其他方法

- `join([separator])`: **用指定的分隔符把数组所有元素拼接成字符串**（即除了最后一个，每个元素转化成字符串并加上分隔符，最后把所有字符串按顺序连接），返回该字符串。 `separator` 表示分隔符，默认为"`,`"。

- `toLocaleString()`: 返回一个字符串表示数组中的元素。数组中的元素将使用各自的 `toLocaleString` 方法转成字符串，这些字符串将使用一个特定语言环境的字符串（例如一个逗号 "`,`"）隔开。

- `toString()`: 返回一个字符串，表示指定的数组及其元素。

- `[Symbol.iterator]`: 通过这个方式可以改写数组对象默认的**迭代器**方法，当然了，一般情况不建议改写。

</br>

## 静态方法

目前静态方法有三个:

- `from(arrayLike[, mapFn[, thisArg]])`: 从一个**类似数组或可迭代对象**中创建一个**新数组**实例，返回新数组。
  - 例如，函数内部的 `arguments` 对象就是一个类数组， `Array.from(arguments)` 可以得到一个数组对象。
  - `arrayLike` 表示要转换成数组的伪数组对象或可迭代对象；
  - `mapFn` 表示新数组中的每个元素会执行该回调函数，可选；
  - `thisArg` 表示执行回调函数 `mapFn` 时 `this` 对象，可选。

- `of(element0[, element1[, ...[, elementN]]])`: **创建**一个包含指定元素的**新数组**。
  - 与 `Array` 构造函数类似，两者唯一差别在于参数为单个整数，
  - `Array` 构造函数得到的是指定长度的空数组，
  - 而 `Array.of()` 得到的是包含该数字的一个数组。

- `isArray(target)`: 用于确定 `target` 的值是**否是为 `Array`** 。返回布尔值。

</br>

## 展开运算符（`...`）

这部分内容在[另一篇文章](./变量声明、解构赋值和展开运算符.md#展开运算符（`...`）)有介绍。

</br>

## 其他

### `reduce()` 方法的妙用

前面介绍到 `reduce()` 可以将数组的成员以特定的方法"累积"成特定的值。

加入数组存放的不是"值"，而是"方法"，**数组就可以作为一个"方法栈"**，把某个值经过"方法栈"后得到计算结果。例子如下：

``` js
let funcStack = [
  n => n + 2,
  n => n ** 3,
  n => n * 8
]
let input = 0,
  result = funcStack.reduce((computed, fn) => {
    return fn(computed);
  }, input);
// ((0 + 2) ^ 3) * 8 = 64
console.log(result);  // 64
```

输入值 `input` 依次经历了三个数学运算，得到最终的结果。










