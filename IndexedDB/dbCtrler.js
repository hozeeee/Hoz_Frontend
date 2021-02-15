// 简单封装

class DbController {
    constructor() {
        this._DBNAME = 'test'
        this._STORENAME = 'datas'
        this._db = null
    }

    // 获取数据库对象
    connectDb() {
        return new Promise((resolve, reject) => {
            /**
             * 请求打开数据库
             * @function IDBFactory.open(dbName,version?)
             *      1@param {String} 数据库名
             *      2@param {+Integer} 版本号(正整数) 
             *      @注意 当版本号不传时，默认连接最新的版本号。当数据库不存在时，自动会创建，版本号默认为1，会触发版本号更新事件。版本号不能回退。
             *      @return {IDBOpenDBRequest}
             */
            let request = indexedDB.open(this._DBNAME, 1)

            // 监听请求报错
            request.onerror = e => {
                console.log('request error', e)
                reject()
            }

            // 监听数据库连接成功
            request.onsuccess = e => {
                console.log('---- db: ', e.target.result)
                this._db = e.target.result
                resolve(e.target.result)
            }

            // 监听数据库版本更新 (当版本号增加或第一次打开数据库时触发)
            request.onupgradeneeded = e => {
                /** 创建对象存储器、创建对象索引，都只能在 "upgradeneeded" 监听器内创建 **/

                let db = e.target.result
                /**
                 * 创建"对象存储器"
                 * @function IDBDatabase.createObjectStore(storeName,options?)
                 *      1@param {String} storeName 对象存储器名字
                 *      2@param {Object} options 可选参数对象，有两个可选属性， keyPath 和 autoIncrement ，介绍看下面
                 *          options@param {String} keyPath 如果为空或未指定，object store 创建时将没有 key path，而是使用 out-of-line keys 。你也能传一个数组作为 keyPath 。
                 *          options@param {Boolean} autoIncrement 如果为 true,  object store 有一个 key generator. 默认为 false。
                 *      @注意 当设置了 keyPath 表明使用"内主键"(in-line keys)，则插入的数据必须包含主键的字段，否则会报错；
                 *      @注意 当 keyPath 为空或未指定，则表明使用"外主键"(out-of-line keys)，此时必须设置 autoIncrement 为 true ，让系统自动设置"自增主键"。
                 *      @return {IDBObjectStore}
                 */
                let objectStore = db.createObjectStore(this._STORENAME, {
                    keyPath: undefined,
                    autoIncrement: true
                });

                /**
                 * 创建对象索引
                 * @function IDBObjectStore.createIndex(indexName,keyPath,objectParameters?)
                 *      1@param {String} indexName 要创建的索引的名称。请注意，可以使用空名称创建索引。
                 *      2@param {String} keyPath 要使用的索引的关键路径。注意，可以创建一个带有空值的索引keyPath，也可以将序列（数组）作为a传递keyPath。
                 *      3@param {IDBIndexParameters} objectParameters 可选
                 *          IDBIndexParameters@param {Boolean} unique 如果为true，则索引将不允许单个键重复值。
                 *          IDBIndexParameters@param {Boolean} multiEntry 如果为true，则当keyPath解析为Array 时，索引将在每个数组元素的索引中添加一个条目。如果为false，它将添加一个包含数组的单个条目。
                 *          IDBIndexParameters@param {String} locale 当前仅适用于Firefox(43+)，不展开细说。
                 *      @return {IDBIndex}
                 *      @注意 此方法只能从VersionChange 事务模式回调中调用此方法。
                 */
                objectStore.createIndex('name', 'name');
                objectStore.createIndex('age', 'age');

                /**
                 * 删除对象索引
                 * @function IDBObjectStore.deleteIndex(indexName)
                 *      @param {String} indexName 要创建的索引的名称。
                 *      @return {undefined}
                 *      @注意 此方法只能从VersionChange 事务模式回调中调用此方法。
                 */
                objectStore.deleteIndex('age');

                // 获取此对象存储器的归属事务，并监听 complete 事件，确保在插入数据前对象仓库已经创建完毕
                /**
                 * .transaction 获取对象存储器归属事务
                 * .oncomplete 设置监听器函数 (此事件的触发必然在 request.onsuccess 之后)
                 */
                objectStore.transaction.oncomplete = e => {
                    console.log('objectStore.transaction.oncomplete', e)
                    this._db = db
                    // 添加几个默认数据
                    let initData = JSON.parse('[{"name":"wangyi","age":12},{"name":"wanger","age":14},{"name":"zhangsan","age":15},{"name":"zhaosan","age":15}]')
                    this.add(...initData)
                }
            }
        })
    }


    // 添加数据 (add方法)
    add(...datas) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {

            /**
             * 创建读写事务 (可修改数据库)
             * @function IDBDatabase.transaction(storeNames,mode?) 
             *      1@param {String|Array} storeNames 事务针对的若干个对象存储器，传入字符串数组；若只对一个对象存储器操作，则可以传入字符串
             *      2@param {String} mode 枚举值，"readonly"、"readwrite"、"versionchange"。事务的模式。默认值是"readonly"。
             *      @return {IDBTransaction}
             *      @提示 db.objectStoreNames 获取所有对象存储器名字，即可用于下面方法的第一个参数，表示针对所有对象存储器的事务。
             *      @注意 只在必要时指定 readwrite 事务，因为可以同时对相同作用域(对象存储器)执行 readnoly 事务；但每个作用域(对象存储器)只能运行一个 readwrite 事务。
             */
            let transaction = this._db.transaction(this._STORENAME, 'readwrite')

            /************* 关于事务的事件 *************************
                事务接收三种不同的 DOM 事件：error、abort 和 complete。
                错误会中断它所处的事务。除非你在错误发生的第一时间就调用了 stopPropagation 并执行了其他操作来处理错误，不然整个事务将会回滚。
                error 事件是冒泡机制，可以在数据库上添加一个全局的错误处理。
                如果你在事务中没有处理一个已发生的错误或者调用 abort 方法，那么该事务会被回滚，并触发 abort 事件。
                在所有请求完成后，事务的 complete 事件会被触发。
            ***************************************************/
            transaction.onerror = e => {}
            transaction.onabort = e => {}
            transaction.oncomplete = e => {}

            /************* 关于事务的生命周期 *************************
                如果你创建了一个事务但是并没有使用它就返回给事件循环，那么事务将会失活。
                保持事务活跃的唯一方法就是在其上构建一个请求。(如下面的 IDBTransaction.objectStore.add() 方法)
            ***************************************************/

            /**
             * 从事务中获取特定的对象存储器
             * @function IDBTransaction.objectStore(OjbectStoreName)
             *      @param {String} OjbectStoreName 对象存储器名字
             *      @return {IDBObjectStore}
             *      @注意 transaction.objectStore()返回的 与 db.createObjectStore() 的对象存储器不是同一个对象
             */
            let objectStore = transaction.objectStore(this._STORENAME);

            for (let data of datas) {
                /**
                 * 添加数据
                 * @function IDBObjectStore.add(value,key=null) 
                 *      1@param {Object} value 添加的数据
                 *      2@param {String} key 可选，默认为null。指定作为键值的值 (当创建对象存储器时没指定"内键",这里就必须指定,否则报错)
                 *      @return {IDBRequest} 在complete事件中监听是否添加成功，而不是success，因为事务在success事件之后还有可能失败。
                 */
                let request = objectStore.add(data)
                // 监听请求成功事件
                request.onsuccess = e => {
                    // 请求成功不代表事务成功，事务失败会导致请求失效
                    resolve()
                }
                request.onerror = err => {
                    reject(err)
                }
            }
        })
    }


    // 删除特定数据
    delete(query) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readwrite').objectStore(this._STORENAME);

            /**
             * 更新或插入数据
             * @function IDBObjectStore.delete(query)
             *      @param {String|IDBKeyRange} query 查询的键值或范围。
             */
            let request = objectStore.delete(query)

            request.onsuccess = _ => {
                resolve()
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }
    // 清空对象存储器
    clear() {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readwrite').objectStore(this._STORENAME);

            /**
             * 更新或插入数据
             * @function IDBObjectStore.clear()
             */
            let request = objectStore.clear()

            request.onsuccess = _ => {
                resolve()
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }


    // 修改数据 (put方法)
    put(item, query) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readwrite').objectStore(this._STORENAME);

            /**
             * 更新或插入数据
             * @function IDBObjectStore.put(item,query?)
             *      1@param {Object} item 更新或插入的数据
             *      2@param {String|IDBKeyRange} query 查询的键值或范围。
             *      @注意 当 query 为空或不存在时，此方法会变为 "插入一条新的记录" 。
             */
            let request = objectStore.put(item, query)

            request.onsuccess = e => {
                // e.target.result 的值为主键的值
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }


    // 查询一条 (若是索引则以1开始)
    get(query = 1) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            // 创建只读事务，并获取对象存储器
            let objectStore = this._db.transaction(this._STORENAME, 'readonly').objectStore(this._STORENAME);

            /**
             * get 查询数据
             * @function IDBObjectStore.get(query) 
             *      @param {String|IDBKeyRange} query 查询的键值或范围。
             *      @return {IDBRequest}
             *      @注意 这种查询方式只针对主键，你必须清楚主键是什么。
             *      @注意 使用 db.createObjectStore 创建对象存储器时，若 keyPath 为空，则主键为"自增索引"，get 方法会搜索索引(从 1 开始)。
             */
            let request = objectStore.get(query)

            request.onsuccess = e => {
                // 类型为对象
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }
    // 查询所有符合
    getAll(query = undefined, count = 0) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readonly').objectStore(this._STORENAME);

            /**
             * getAll 查询数据
             * @function IDBObjectStore.getAll(query?,count?) 
             *      1@param {String|IDBKeyRange} query 查询的键值或范围，若空，则查询所有。
             *      2@param {Number} count 最大的查询条数，0或空，则查询所有。(0 ~ 2^32 - 1)
             *      @return {IDBRequest}
             *      @注意 这种查询也是针对主键，范围搜索也是针对主键，你必须清楚主键是什么。
             */
            let request = objectStore.getAll(query, count)

            request.onsuccess = e => {
                // 类型为数组
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }

    // 查询一个键
    getKey(query) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readonly').objectStore(this._STORENAME);

            /**
             * getKey 查询数据
             * @function IDBObjectStore.getKey(query) 
             *      1@param {String|IDBKeyRange} query 查询的键值或范围，若空，则查询所有。
             *      @return {IDBRequest}
             *      @注意 此方法一般用于查询特定条件的记录情况，不在乎数据的值。如，查询24小时内的最早添加的一条记录时间(前提是时间作为主键)。
             */
            let request = objectStore.getKey(query)

            request.onsuccess = e => {
                // 类型为键的"值"
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }
    // "数组版"的"查询一个键"
    getAllKeys(query = undefined, count = 0) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readonly').objectStore(this._STORENAME);

            /**
             * getAllKeys 查询数据
             * @function IDBObjectStore.getAllKeys(query?,count?) 
             *      1@param {String|IDBKeyRange} query 查询的键值或范围，若空，则查询所有。
             *      2@param {Number} count 最大的查询条数，0或空，则查询所有。(0 ~ 2^32 - 1)
             *      @return {IDBRequest}
             *      @注意 此方法一般用于查询特定条件的记录情况，不在乎数据的值。如，查询24小时内的添加记录数(前提是时间作为主键)。
             */
            let request = objectStore.getAllKeys(query, count)

            request.onsuccess = e => {
                // 类型为数组
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }

    // 查询符合条件的数量
    count(query) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readonly').objectStore(this._STORENAME);

            /**
             * 查询与提供的键匹配的记录总数
             * @function IDBObjectStore.count(query?) 
             *      @param {String|IDBKeyRange} query 查询的键值或范围，若空，则查询所有。
             *      @return {IDBRequest}
             */
            let request = objectStore.count(query)

            request.onsuccess = e => {
                // 类型为整数
                console.log(e.target.result)
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }

    // 打开游标
    openCursor(query, direction) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readwrite').objectStore(this._STORENAME);

            /**
             * 查询与提供的键匹配的记录总数
             * @function IDBObjectStore.openCursor(query?,direction?) 
             *      1@param {String|IDBKeyRange} query 查询的键值或范围，若空，则查询所有。
             *      2@param {String|IDBKeyRange} direction  游标移动的方向，默认"next"。有效值："next"、"nextunique"、"prev"、"prevunique"。
             *      @return {IDBRequest}  
             */
            let request = objectStore.openCursor(query, direction)

            request.onsuccess = e => {
                console.log(e.target.result)
                /**
                 * e.target.result 的类型为 IDBCursor 。
                 *  包含如下方法：
                 * @function IDBCursor.delete() 删除游标所在的这条记录，返回IDBRequest对象，游标位置不变。
                 * @function IDBCursor.update(value) 更新游标所在的这条记录，返回IDBRequest对象，游标位置不变。
                 * @function IDBCursor.continue(key?) 返回下一个游标，或下一个特定键值的游标。
                 *      @param {String} key 将光标定位到的键。
                 * @function IDBCursor.advance(count) 返回游标前移count次的游标。
                 * @function IDBCursor.continuePrimaryKey(key,primaryKey) 将游标移至键到与键参数匹配以及主键与主键参数匹配的项目。()
                 *      1@param {String} key 查询的键 
                 *      2@param {String} primaryKey 游标当前的有效键
                 *  包含如下(只读)属性：
                 * @attr primaryKey 返回游标的当前有效主键
                 * @attr request 返回游标的请求对象  
                 * @attr key 返回记录在光标位置处的键
                 * @attr direction 返回游标的方向  
                 * @attr source 返回游标正在迭代的 IDBObjectStore 或 IDBIndex
                 * @注意 一般用法是，用 cursor 对象判断游标是否有效；用 cursor.continue() 移动游标。
                 */
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }
    // 打开键游标 (与 openCursor 的用法和返回值基本一致，除了此方法获取的游标没有 value 属性用去数据项)
    openKeyCursor(query, direction) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise((resolve, reject) => {
            let objectStore = this._db.transaction(this._STORENAME, 'readwrite').objectStore(this._STORENAME);
            let request = objectStore.openCursor(query, direction)
            request.onsuccess = e => {
                // e.target.result 没有 value 属性
                resolve(e.target.result)
            }
            request.onerror = err => {
                reject(err)
            }
        })
    }

    // 使用命名索引查询 
    getIndex(indexName) {
        if (!this._db) return Promise.reject('还没连接数据库,请先调用connectDb方法')
        return new Promise(resolve => {
            let objectStore = this._db.transaction(this._STORENAME, 'readwrite').objectStore(this._STORENAME);

            /**
             * 在当前对象存储中打开一个命名索引，该命名索引可用于例如返回一系列使用游标按该索引排序的记录。 
             * @function IDBObjectStore.index(indexName) 
             *      @param {String} indexName 要打开的命名索引的名称。
             *      @return {IDBIndex}
             *      @注意 使用此方法的前提条件是，在 VersionChange 事务模式回调中使用 createIndex 创建了索引
             *      @注意 IDBIndex 拥有与 IDBObjectStore 所有的查询方法，如 count、get、openCursor 等(注意，查询主键变为索引的键)，同样返回 IDBRequest 。
             *      @注意 此方法返回的结果会根据 "索引的值" 来排序，为非默认的插入顺序。
             */
            let myIndex = objectStore.index(indexName)

            resolve(myIndex)
        })
    }
}