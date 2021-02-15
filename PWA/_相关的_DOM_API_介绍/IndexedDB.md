
# 简介

- IndexedDB 是**事务型的**。对 - IndexedDB 的增删改查都需要先创建**事务**，一旦事务中的其中一个操作失败，整个事务的所有操作都被废弃。

- IndexedDB 是**对象储存数据库**。- IndexedDB 存储的是对象，这与其他的 NoSQL 一致。

- IndexedDB 是**索引数据库**。可以在任何对象存储中添加**索引**，并使用它来检索对象。

- IndexedDB 是**基于历览器的**。- IndexedDB 完全基于浏览器，即使不能上网。这就表示本地数据库不会反映到服务器。

- IndexedDB 是**遵循同源策略**。意味着你不能访问别的站点的 - IndexedDB 的数据。

- IndexedDB 的**错误事件遵循冒泡机制**。错误事件都是针对产生这些错误的请求的，然后事件冒泡到事务，然后最终到达数据库对象。

# 相关基类

## IDBOpenDBRequest

## IDBDatabase

# 基本API

## 打开/创建数据库

- 在浏览器的**隐私模式**（Firefox 的 Private Browsing 模式和 Chrome 的 Incognito 模式）下是被完全禁止的。尝试打开会报错。
- `open()` 第一个参数为目标数据库名。当打开的数据库不存在时，自动创建，并打开它。
- `open()` 第二个参数是版本号。版本号初始为空，版本号必须大于等于当前版本号，否则会报错。
- `open()` 返回的是一个 **`IDBOpenDBRequest` 对象**。
- **版本号必须为正整数**，当个使用正浮点数时，会被"四舍五入"取整。
- 版本号的改变意味着**数据库结构需要改变**。所以一般的"增删改查"是没必要改变版本号。
- 当版本号改变时，会触发 **`upgradeneeded` 事件**。 upgradeneeded 监听器是我们唯一可以修改数据库结构的地方。

``` js
// 特性检测
if (window.indexedDB) {
  // 打开数据库
  const request = window.indexedDB.open('my-database', 1);
}
```

## IDBOpenDBRequest 对象的监听器

- 监听器有三个： `onsuccess` 、 `onerror` 、 `onupgradeneeded` 。
- `onupgradeneeded` 在版本号变化的时候触发，用于改变数据库结构。
- `onsuccess` 在数据库成功打开后触发。
- `onerror` 在数据库打开失败后触发。
- 监听器的 `event` 对象中的 `target` 指向 `IDBOpenDBRequest` 对象，通过它可以获取数据库对象，即 `event.target.result`。

``` js
// 接上面例子...
request.onerror = e => {
  // 打印错误信息
  let errName = `${e.srcElement.error.name}: `,
      errMsg = e.srcElement.error.message
  console.log(errName, errMsg);
}
// 成功打开监听器
request.onsuccess = e => {
  // 获取数据库对象，然后做其他操作...
  const db = e.target.result
}
// 版本更新监听器
request.onupgradeneeded = e => {
  // 获取数据库对象，然后做其他操作...
  const db = e.target.result
}
```

## 数据库对象

- 获取数据库对象有两种方式，看下面示例代码。
- 只有当版本号更新的情况，数据库对象才能使用 `createObjectStore()` 方法创建对象仓库。

``` js
// 方法一： 通过 IDBOpenDBRequest 对象的 result 属性获取
let request = window.indexedDB.open('my-database', 1);
let db = request.result;
// 方法二： 通过 IDBOpenDBRequest 对象的监听器的事件对象上 target.result 属性获取 (onsuccess监听器同理)
request.onupgradeneeded = event => {
  let db = event.target.result;
};
```

# 注意

- IndexedDB 在浏览器的隐私模式（Firefox 的 Private Browsing 模式和 Chrome 的 Incognito 模式）下是被完全禁止的。 隐私浏览的全部要点在于不留下任何足迹，所以在这种模式下打开数据库的尝试就失败了。

- 
