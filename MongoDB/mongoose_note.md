
# 起步

## 安装 mongoDB

## 安装 mongoose 库

## 管理 mongoDB 的可视化软件


# 基本概念

1. 连接数据库

``` js
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test')
```

## Schema

Mongoose 的一切始于 Schema。每个 schema 都会映射到一个 **MongoDB collection** ，并定义这个collection里的文档的构成。

在 Schema 中定义数据的 **key** 及 值的类型(**SchemaTypes**)。当我们传入非指定类型的值时，值会被转换。

下面是官方的例子：

``` js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});
```

### SchemaTypes

允许使用的 SchemaTypes 有：

+ String：字符串
+ Number：数值
+ Date：日期
+ Buffer：缓冲区
+ Boolean：布尔值
+ Mixed：任意类型
+ ObjectId：ID 号
+ Array：数组

除了像这样直接指定类型：

``` js
let schema1 = new Schema({
  str: Schema.Types.String,
  num: Schema.Types.Number,
  // ...
})
```

还能赋值一个包含 **type** 属性的对象：

``` js
let schema2 = new Schema({
  test: {
    type: String,
    lowercase: true
  }
});
```

而该对象的可选属性如下：

+ 全部可用的
  + `required`: 是否为必须值，布尔值或函数。
  + `default`: 默认值，任何值或函数
  + `select`: 布尔值 指定 query 的默认 projections
  + `validate`: 验证函数。
  + `get`: getter 函数。
  + `set`: setter 函数。
  + `alias`: 别名，使用别名等效于原名 (仅mongoose >= 4.10.0)。

+ 索引相关 (暂时不了解用途)
  + `index`: 布尔值 是否对这个属性创建索引
  + `unique`: 布尔值 是否对这个属性创建唯一索引
  + `sparse`: 布尔值 是否对这个属性创建稀疏索引

+ String
  + lowercase: 布尔值 是否在保存前对此值调用 .toLowerCase()
  + uppercase: 布尔值 是否在保存前对此值调用 .toUpperCase()
  + trim: 布尔值 是否在保存前对此值调用 .trim()
  + match: 正则表达式 创建验证器检查这个值是否匹配给定正则表达式
  + enum: 数组 创建验证器检查这个值是否包含于给定数组

+ Number
  + min: 数值 创建验证器检查属性是否大于或等于该值
  + max: 数值 创建验证器检查属性是否小于或等于该值

+ Date
  + min: Date
  + max: Date

## Model

想进一步操作，需要把 schema 转换成一个 **`Model`** ：

``` js
let Blog = mongoose.model('Blog', blogSchema);
```

## Document

**`documents`** 是 Models 的实例。 Document 有很多自带的实例方法，除此之外，我们可以为单个 document 设置自己的方法，也可以在 Model 中定义方法，使得所有继承自该 Model 的 document 都拥有该方法。
