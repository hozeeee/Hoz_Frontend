
# demo 说明

- 此目录下，运行 `node app.js` 启动服务。

- [`dbCtrler.js`](./dbCtrler.js) 文件对 indexDB 的 API 进行简单的封装， indexDB API 的具体介绍也在里面。

- [`index.htm`l](./index.html) 文件是页面代码，主要是调用 `dbCtrler.js` 的方法。

- `app.js` 和 `style.css` 可以忽略不看。

</br>
</br>
</br>

# 简单介绍

IndexedDB 的操作基本就如下几步：

1. 连接数据库，获取"连接对象"
    - 目标数据库不存在时，会自动创建，触发 upgradeneeded 事件，此时是唯一能对对象存储器结构修改的地方
    - 连接数据库也可以附带版本号，版本号增加代表对象存储器的"命名索引"或主键发生一定改变，或者创建新的对象存储器
2. 创建只读或读写"事务"，事务具有"原子性"
3. 从事务中获取"对象存储器"
4. 调用对象存储器的方法，实现"增删改查"操作

详细的介绍在代码文件 [dbCtrler.js](dbCtrler.js) 中，基本涵盖了所有 API ，其他文件可以忽略不看，运行 `node app` 可以看到一个简单的项目(浏览器需要支持`class`语法,能联网获取vue.js)。建议使用成熟的库，除非是做一些简单的应用。

代码文件中会写明是对象类型，不清楚其中的属性方法，可以到 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API) 查看详细。

</br>
</br>
</br>

# IndexedDB 相关的库

1. PouchDB </br>
    特点： 让你的应用可以在浏览器和服务器之间同步数据。优先使用 IndexedDB ，缺少支持则使用 Web SQL 作为回退。

2. localForage </br>
    特点： 依赖于 IndexedDB 和 Web SQL ，以 localStorage 作为回退。

3. Dexie.js </br>
    特点： 封装了 IndexedDB ，提升了 IndexedDB 的开发体验。

4. IndexedDB Promised </br>
    特点： “ Promise 风格的 IndexedDB ”。
