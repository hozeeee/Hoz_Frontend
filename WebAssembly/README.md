
# 简介

WebAssembly 实际上是一个虚拟机，包含了一门低级汇编语言和对应的虚拟机体系结构。优点是，文件小、加载快、执行效率非常高。

目前包括 Chrome 、 Firefox 、 Safari 、 Opera 、 Edge 在内的大部分主流浏览器均已支持 WebAssembly 。Node.js 8.0 之后的版本也能运行 WebAssembly 。

浏览器加载并运行的 WebAssembly 程序是二进制格式的 WebAssembly 汇编代码，其扩展名通常是 `.wasm` 。

二进制文件`.wasm`可以通过 WebAssembly 提供的一种基于**S-表达式**的文本格式，其扩展名通常是 `.wat` 。

[wat2wasm](https://github.com/emilbayes/wat2wasm) 工具可以将 `.wat` 文件编译成 `.wasm` 文件，使用方法很简单： `wat2wasm input.wat -o output.wasm` 。该功能还是查看汇编输出： `wat2wasm test.wat -v` 。

</br>
</br>

# WebAssembly 的关键概念

1. **模块**：是已被编译为可执行机器码的二进制对象，可以简单类比为操作系统的可执行程序(.exe)，是无状态的，是由 `.wasm` 编译而来的。

2. **内存**：在 WebAssembly 中使用的是一段连续的内存，然后对其进行读写。在网页环境下，内存是由 ArrayBuffer 对象实现的，JS 和 WebAssembly 可以通过内存交换数据。

3. **表格**：用于存储**函数的引用**。

4. **实例**：用于指代一个模块及其运行时的所有状态，包括内存、表格以及导入的对象等。模块只有在实例化之后才能被调用。

按照目前规范，一个实例只能拥有一个内存对象以及一个表格对象。；但内存对象和表格对象可以通过导入/导出对象被多个实例公有。

</br>
</br>

# WebAssembly 程序的生命周期

WebAssembly 程序从开发到运行于网页，大致分为以下几个阶段：

1. 使用 WebAssembly 文本格式或其他语言编写程序，然后编译成 WebAssembly 汇编格式文件(.wasm)。
2. 在网页中使用 fetch、XMLHttpRequest等方法获取`.wasm`文件。
3. 将`.wasm`编译为模块(过程中进行合法性检查)。
4. 实例化。初始化导入对象，创建模块的实例。
5. 执行实例的导出函数。

流程示意图：

``` txt
『.wat』--------(wat2wasm)--------┐
                                  ↓
『C/C++ File』--(Emscripten)--→『.wasm』--(fetch)--→『ArrayBuffer』
                                  ↑                      |
『Go File』-------(Go Build)------┘                   (complie)
                                                         ↓
      『ExportObj』←----『Instance』←--(instantiate)--『Module』
                                           ↑
                                     『ImportObj』
```

</br>
</br>

# "hello, WebAssembly"

具体代码请看 [hello_demo](./hello_demo) 。

启动项目的方法是：

- 执行 `node server.js` 启动服务器。
- 打开 `http://localhost:3000` 。
- 页面中点击 "test" 按钮。

需要说明：

- `hello.wasm` 文件是 `wat2wasm` 生成的二进制文件，查看代码请看 `hello.wat` 。
- `hello.wat` 文件中不能有中文，即使是注释也不行，否则会编译失败。

下面简单介绍 `hello.wat` 文件：

``` wat
;; ";;" 用于注释，与 JS 的 "//" 相同作用
(module
  ;; 由于 WebAssembly 虚拟机本身没有提供打印函数，需要导入 JS 函数
  ;; 将 js.print 对象导入为函数，并命名为 js_print ，有两个参数，都是 32 位整型
  (import "js" "print" (func $js_print (param i32 i32)))
  ;; 将 js.mem 对象导入为内存
  (import "js" "mem" (memory 1))
  ;; 写入内存
  (data (i32.const 0) "hello,wasm")
  ;; 定义导出函数，提供给外部使用
  (func (export "hello")
    i32.const 0
    i32.const 13
    call $js_print
  )
)
```

</br>
</br>

# JavaScript 中的 WebAssembly 对象

关于 `WebAssembly.*Streaming` ：即`WebAssembly.complieStreaming()`和`WebAssembly.instantiateStreaming()`，这两个方法对浏览器的要求比较高，目前Safari全系不支持，是不建议使用的。

首先对下面可能出现的参数说明：

- `bufferSource`: 包含 WebAssembly 二进制代码(.wasm)的 `TypedArray` 或 `ArrayBuffer` 。
- `importObj`: 导入 WebAssembly 实例的对象，可以包含 JavaScript 方法、 `WebAssembly.Memory` 和 `WebAssembly.Table` 。
- `module`: 已编译好的模块对象，类型为 `WebAssembly.Module` 。
- `wasmFile`: 未处理的 `.wasm` 文件对象，例如通过 `fetch('/my.wasm')` 获取的。
- `module`: 编译好的模块对象。
- `sectionName`: 自定义段的名字。
- `memDesc`: 新建内存的参数。包含如下属性：
  - `initial`: 内存的初始容量，单位是"页"。(1页=64KB)
  - `maximum`: 可选，内存的最大容量，单位是"页"。
- `tableDesc`: 新建表格的参数。包含如下属性：
  - `element`: 存入表格的元素的类型。(目前只有`anyfunc`,即函数引用)
  - `initial`: 表格的初始容量。(这里的容量就是索引的个数,即数组长度)
  - `maximum`: 可选，表格的最大容量。

WebAssembly 对象的方法/属性介绍：

- `WebAssembly.compile(bufferSource)`: 将`.wasm`代码编译成 `WebAssembly.Module` 。返回 `Promise<WebAssembly.Module>` 。
- `WebAssembly.complieStreaming(wasmFile)`: 与 `WebAssembly.compile()` 方法类似，参数是`.wasm`的源文件，如`WebAssembly.complieStreaming(fetch('/hello.wasm'))`。

- `WebAssembly.instantiate(bufferSource, importObj?)`: 将`.wasm`代码编译成 `WebAssembly.Module` ，并创建其第一个实例。返回 Promise ，对象中包含两个属性：
  - `module`: 编译好的模块对象，类型为 `WebAssembly.Module` 。
  - `instance`: 上述 Module 的第一个实例，类型为 `WebAssembly.Instance` 。
- `WebAssembly.instantiate(model, importObj?)`: 上述方法的重载。基于已编译好的模块创建实例。
- `WebAssembly.instantiateStreaming(wasmFile)`: 与 `WebAssembly.instantiate()` 方法的第一种重载类似，但参数是`.wasm`的源文件，如`WebAssembly.instantiateStreaming(fetch('/hello.wasm'))`。

- `WebAssembly.validate(bufferSource)`: 验证`.wasm`代码是否合法。返回布尔值。

- `WebAssembly.Module(bufferSource)`: 用于**同步**的编译`.wasm`为模块。返回编译好的模块对象。

- `WebAssembly.Module.exports(module)`: 用于获取模块对象的导出信息。返回导出信息的数组。

- `WebAssembly.Module.imports(module)`: 用于获取模块对象的导入信息。返回导入信息的数组。

- `WebAssembly.Module.customSections(module, sectionName)`: 用于获取模块中的**自定义段(section)**的数据。(遗憾的是，目前`.wat`不支持自定义段)

- `WebAssembly.Instance(module, importObj?)`: 创建模块实例的**构造函数**，即`var memory = new WebAssembly.Instance(module, importObj?)`。

- `WebAssembly.Memory(memDesc)`: 创建表格内存的**构造函数**，即`var memory = new WebAssembly.Memory(memDesc)`。

- `WebAssembly.Table(tableDesc)`: 创建表格对象的**构造函数**，即`var table = new WebAssembly.Table(tableDesc)`。

- `WebAssembly.Instance.prototype.exports`: 只读，包含实例的所有导出单数。

- `WebAssembly.Memory.prototype.buffer`: 用于访问内存对象的 `ArrayBuffer` 。

- `WebAssembly.Memory.prototype.grow(num)`: 用于扩大内存对象的容量，返回内存对象扩大前的容量(单位是"页")。注意，可能会引发内存对象对 `ArrayBuffer` 重分配，从而使引用它的 TypeArray 失效，如 `var i32 = new Uint32Array(instance.exports.memory.buffer)` 。

- `WebAssembly.Table.prototype.get(index)`: 用于获取表格中指定索引位置的函数索引。

- `WebAssembly.Table.prototype.length`: 用于获取表格的当前容量(即数组长度)。

- `WebAssembly.Table.prototype.set(index, value)`: 将一个 WebAssembly 函数的引用存入表格的指定索引处。

- `WebAssembly.Table.prototype.grow(num)`: 用于扩大表格对象的容量，返回表格对象扩大前的容量。

</br>
</br>

# WebAssembly 汇编语言

## S-表达式

WebAssembly 文本格式是以 **S-表达式** 表示的。S-表达式是用于描述**树状结构**的一种简单文本格式，其特征是书的每个结点均被一对圆括号“`(...)`”包围，结点可以包含子结点。

最简单的 WebAssembly 模块如下：

``` wat
(module)
```

尽管 `module` 下什么都没有，这仍然是合法的 WebAssembly 模块。

左括号“`(`”后紧跟着的是**结点类型**，随后是由分隔符（空格、换行符等）分隔的**属性和子结点列表**。

结点类型有：

|  结点  |          说明           |
|:------:|:-----------------------:|
| module | 模块的根节点，即 Module |
| memory |      内存(Memory)       |
|  data  |   内存(Memory)初始值    |
| table  |       表格(Table)       |
|  elem  | 表格(Table)元素的初始值 |
| import |        导入对象         |
| export |        导出对象         |
|  type  |        函数签名         |
| global |        全局变量         |
| local  |        局部变量         |
|  func  |          函数           |
| param  |        函数参数         |
| result |       函数返回值        |
| start  |        开始函数         |

## 数据类型

WebAssembly 中有 4 种数据类型：

- `i32`: 32 位整型数。
- `i64`: 64 位整型数。
- `f32`: 32 位浮点数，IEEE 754 标准。
- `f64`: 64 位浮点数，IEEE 754 标准。

WebAssembly 采用的是"**数据类型后置**"的表达方式。如 `(param i32)` ，定义了 `i32` 类型的参数。

注意， WebAssembly 并不区分有/无符号整数。然而某些操作需要明确区分有/无符号整数，一般来说，无符号版本的指令后缀为 `_u` ；而有符号版本的后缀为 `_s` 。如 `i32.gt_u` 、 `i32.gt_s` 。

还有， WebAssembly 是强类型语言，不支持隐式类型转换。

## 函数

除了 `func` 类型标签外，函数包含了三部分： `(func <函数别名?> <函数签名> <局部变量表> <函数体>)` 。

**函数签名**表明了函数的参数及返回值，它由一系列 `param` 结点以及 `result` 结点构成。如： `(func (param i32) (param f32) (result f64))` ，代表有两个参数(分别是`i32`类型和`f32`类型)和一个返回值(`f64`类型)。注意，返回值只能有一个，即只能有一个 `result` 结点，若无返回值则不用写 `result` 结点。

**局部变量表**由一系列 `local` 结点组成。如 `(func (result f64) (local i32) (local i64) ...` 。

**函数体**是一系列 WebAssembly 汇编指令的线性列表。如：

``` wat
(func
  i32.const 0
  i32.const 13
  call $js_print
)
```

**函数调用**有两种方式，分别是直接调用和简介调用。

**直接调用**使用 `call` 指令： `call <函数索引/函数别名>` 。

**间接调用**通过表格和 `call_indirect` 指令协同完成的。这种情况比较复杂，下面给出例子：(复制代码使用前,请把中文注释去掉)

``` wat
(module
  ;; 创建表格，存放两个函数索引
  (table 2 anyfunc)
  ;; 指定存放的函数
  (elem (i32.const 0) $plus42 $plus13)
  ;; 定义函数签名 (提供给间接调用)
  (type $type_0  (func (param i32) (result i32)))
  (func $plus13 (param i32) (result i32)
    i32.const 13
    get_local 0
    i32.add
  )
  (func $plus42 (param f32) (result f32)
    get_local 0
  )
  (func (export "call_by_index") (param $id i32) (param $input i32) (result i32)
    get_local $input              ;; "间接调用"的函数的参数
    get_local $id                 ;; 指定表格中的函数的索引
    call_indirect (type $type_0)  ;; 只有$id为1时(即调用$plus13)，才不会报错；否则将抛出WebAssembly.RuntimeError
  )
)
```

## 变量

WebAssembly 的变量分为**局部变量**和**全局变量**，作用域也符合"常识"。

``` wat
(module
  ;; global
  (global (mut i32) (i32.const 666))
  (global f32 (f32.const 3.14159))

  (func
    ;; local
    (local f64)
    (local i32)

    i32.cosnt 123
    set_local 1

    get_local 0   ;; f64
    get_local 1   ;; 123

    get_global 0  ;; 666
    get_global 1  ;; 3.14159
  )
)
```

`get_local`/`set_local` 分别对局部变量的读写；`get_global`/`set_global` 分别对全局变量的读写。

例子中的第一个全局变量使用了 `(mut i32)` ，这表示该全局变量是**可变的**。即类型结点包含 `mut` 表示是可变全局变量，否则为只读全局变量。

还有， WebAssembly 也有"**变量提升**"，即无需遵守先声明后使用的规则。能使用"变量提升"的全局对象(全局变量、函数、表格、内存、导入对象)。例子如下：

``` wat
(module
  (func (result f32)
    get_local $pi
  )
  (global $pi f32 (f32.const 3.14159))
)
```

## 内存读写

使用 `memory` 关键字**创建内存**，新建内存中所有字节的默认值都是 0 ，用 `data` 关键字为其赋值。例子如下：

``` wat
(module
  (memory 1)
  (data (offset i32.const 0) "hellu") ;; "offset"表示偏移量,也可以省略
  (data (i32.const 4) "o world")      ;; "o"会覆盖之前的"u"
)
```

**读取内存**的数据时，需要先将内存地址(起始偏移)压入栈中，然后调用指令 `load` 将地址弹出，从内存中读取数据并压入栈中。例子如下：

``` wat
i32.const 12
i32.load
;; 与上面等价
i32.const 4
i32.load offset=8 align=4
```

上面例子看出， `load` 指令还可以指定额外偏移(`offset`)和对齐标签(`align`)：

- 额外偏移(`offset`)：在起始地址上再偏移的值，对于上面例子，就是 `4+8` ，此属性的默认值是 `0` ，最大有效值为 `2^32` 字节。
- 对齐标签(`align`)：提示虚拟机按 `4` 字节对齐来读取数据。在当前标准下，此属性的值只能为 1、2、4、8 (2的整数次幂)。从内存中读取数据时，地址是否对齐不会影响执行结果，但会影响执行效率。
  - 如果读取的数据长度与 align 完全相等，且有效地址为 align 的整数倍，则执行效率最高；
  - 如果 align 小于要读取的数据的长度，且有效地址是 align 的整数倍，则执行效率较低。
  - 如果有效地址不是 align 的整数倍，则执行效率最低。

除此之外， WebAssembly 还提供"部分读取"的指令：

- `i32.load_8u`: 读取 1 字节，并按有符号整型扩展为 i32 (高位填充0,最高位为符号位) 。
- `i32.load_8s`: 读取 1 字节，并按有符号整型扩展为 i32 (高位填充0) 。
- `i32.load_16u`: 读取 2 字节，并按有符号整型扩展为 i32 (高位填充0,最高位为符号位) 。
- `i32.load_16s`: 读取 2 字节，并按有符号整型扩展为 i32 (高位填充0) 。
- `i64.load_8u`: 读取 1 字节，并按有符号整型扩展为 i64 (高位填充0,最高位为符号位) 。
- `i64.load_8s`: 读取 1 字节，并按有符号整型扩展为 i64 (高位填充0) 。
- `i64.load_16u`: 读取 2 字节，并按有符号整型扩展为 i64 (高位填充0,最高位为符号位) 。
- `i64.load_16s`: 读取 2 字节，并按有符号整型扩展为 i64 (高位填充0) 。
- `i64.load_32u`: 读取 4 字节，并按有符号整型扩展为 i64 (高位填充0,最高位为符号位) 。
- `i64.load_32s`: 读取 4 字节，并按有符号整型扩展为 i64 (高位填充0) 。

把数据**写入内存**是，需要三步：将内存地址入栈；将数据入栈；调用 `store` 指令。例子如下：

``` wat
i32.const 12  ;; addres
i32.const 42  ;; vaule
i32.store
;; 与上面等价
i32.const 4   ;; addres
i32.const 42  ;; vaule
i32.store offset=8 align=4
```

除此之外， WebAssembly 还提供"部分写入"的指令：

- `i32.store8`: 将低 8 位写入内存(写入1字节)。
- `i32.store16`: 将低 16 位写入内存(写入2字节)。
- `i64.store8`: 将低 8 位写入内存(写入1字节)。
- `i64.store16`: 将低 16 位写入内存(写入2字节)。
- `i64.store32`: 将低 32 位写入内存(写入4字节)。

关于内存容量与扩容：

- 使用 `memory.size` 可以获取内存的当前容量。
- 使用 `memory.grow` 可以对内存扩容。

## 控制流指令

控制流指令，是指改变代码执行顺序，使其不在按照声明的顺序线性执行的一类特殊的指令。包括前面说到的 `call` 和 `call_indirect` 。

### nop

什么也不干。

### unreachable

表示"不应该执行到这里"，当执行到 unreachable 指令时，会抛出 `WebAssembly.RuntimeError` 的错误。

### block/end

`block` 和 `enb` 及其包裹的代码构成了一个整体，称之为**指令块**。块内有自己的作用域(独立的栈帧)，也能有返回值(不是必须的)，与无参数的函数非常相似。例子如下：

``` wat
block (result i32)
  i32.const 13
end
```

### if/else/end

与大多数语言一样，不多赘述。与 `block` 一样有自己的作用域和返回值(不是必须的)。

``` wat
(func (param $a i32) (result i32)
  get_local $a
  if (result i32)
    i32.const 13
  else
    i32.const 42
  end
)
```

例子中，以 `$a` 的值为判断条件，但其值不为 0 时，返回 `13` ；否则返回 `42` 。

### loop/end

如果指令内部不含[**跳转指令**](#跳转指令)， `loop` 的表现与 [`block`](#block/end) 一致。

``` wat
block (result i32)
  i32.const 13
end
```

### 跳转指令

跳转指令公有 4 个，包括 `br` 、 `br_if` 、 `return` 、 `br_table` 。

具体介绍他们之前，我们先介绍 **label 索引**。由于指令块是可以嵌套的， label 索引则是用于描述当前指令块的嵌套层树，最里层是 0 ，没往外一层索引值加 1 ，且 label 索引也能命名。例子如下：

``` wat
if $L1
  nop
  block $L2
    nop
    loop $L3
      nop
    end   ;; end of $L3
  end     ;; end of $L2
end       ;; end of $L1
```

首先介绍 `br` ，其语法是 `br <label索引值/label名字>` 。其作用是**跳出指令块**，即到达指令块的后续点。

对于 `block` 、 `if` 等普通代码块，若 `br` 的参数为数值 0 ，则跳至当前指令块的结束点(`end`)，每加 1 就往外一层，如此类推；若参数为 label 别名，则跳到该代码块的结束点(`end`)。例子如下：

``` wat
block (result i32)
  i32.const 13
  br 0
  ;; 下面两行代码会被略过
  drop
  i32.const 42
```

而对于 `loop` 指令块， `br` 会跳到指定代码块的开头(`loop`后)。在下面例子中，会形成死循环：

``` wat
loop
  ...
  br 0  ;; 跳回到此代码块的开头，形成死循环
end
```

`br_if` 与 `br` 基本相同，只是 `br_if` 前面需要一个条件判断。

`return` 指令用于跳出至当前函数的结尾，无论是多少层代码块嵌套里。

`br_table` 指令较前面几个会复杂一点，语法是 `br_table <l_1> <l_2> ... <l_default>` ，意思是在此指令前需要一个数值，代表"表格"的索引(用于指定`<l_1> <l_2> ...`中的第几个)，否则就跳出默认的层数(即`l_default`)。例子如下：

``` wat
block
  block
    block
      get_local $i    ;; index
      br_table 2 1 0  ;; table:[2,1] default:0
    end
  end
end
```

上面例子中，当 `$i` 值为 0 时，等效于 `br 2` ；当 `$i` 值为 1 时，等效于 `br 1` ；当 `$i` 值大于等于 2 时，等效于 `br 0` ；

## 别名

在 WebAssembly 中，都是通过索引来标识的。如下面例子中，两个函数的索引分别是 0 和 1 。

``` wat
(module
  (func ...)  ;; func[0]
  (func ...)  ;; func[0]
)
```

为了方便程序员开发，引入了"**别名**"这种语法糖，方法就是在结点类型后增加一个以 `$` 开头的名字。需要注意，这仅仅是语法糖，在 `.wat` 转换成 `.wasm` 后，别名会被替换成索引值。

**函数**的别名使用：

``` wat
```

**全局变量**的别名使用：

``` wat
(module
  (global $pi f32 (f32.const 3.14159))  ;; global
  ;; func
  (func $add (param $p1 i32)            ;; param
    (local $lo f64)                     ;; local
  )
)
```

## 导出/导入

WebAssembly 中可以导出/导入的包括内存、表格、函数、只读全局变量。

**导出对象**有两种方法：

1. 在要导出的对象的类型后加入 `(export "export_name")` 。如下：

    ``` wat
    (module
      (func (export "exp_func") (result i32)
        i32.const 13
      )
      (memory (export "exp_mem) 1)
      (table (export "exp_tab) 2 anyfunc)
      (global (export "exp_glob) f32 (f32.const 3.141598))
    )
    ```

    一般是导出函数的频率比较高，作为提供给 JavaScript 访问 WebAssembly 模块功能的入口。

2. 除了上面的方法，还可以通过单独的 `export` 结点声明导出对象。如下：

    ``` wat
    (module
      (func (result i32)
        i32.const 13
      )
      (memory 1)
      (table $my_tab 2 anyfunc)
      (global $my_glob f32 (f32.const 3.141598))
      ;; exports
      (export "exp_func" (func 0))
      (export "exp_mem" (memory 0))
      (export "exp_table" (table $my_tab))
      (export "exp_glob" (global $my_glob))
    )
    ```

**导入对象**的语法只有一种。但需要注意，导入函数必须先于内部函数定义，所以一般在 `module` 的开始处声明。例子如下：

``` wat
(module
  (import "js" "memory" (memory 1))
  (import "js" "table" (table 1 anyfunc))
  (import "js" "print_i32" (func $js_print_i32 (param i32)))
  (import "js" "global_pi" (global $pi f32))
)
```

例子中使用了二级(可任意层级)名字空间的方式对外部导入的对象进行识别，这必须与导入对象的结构对应。对于上述例子，导入的对象应该是 `let importObj = {js: {print_i32, memory, table, global_pi}}` 。

假如把 WebAssembly 看作CPU ，那么导入/导出对象可以看作 CPU 的 I/O 接口。

## start()函数

start() 函数类似于其他语言的"构造函数"，在模块实例化的开始执行的一个函数，一般放在 `module` 的开头。例子如下：

``` wat
(module
  (start $print_pi)
  (import "js" "print_f32" (func $js_print_f32 (param f32)))
  (func $print_pi
    f32.const 3.14158
    call $js_print_f32
  )
)
```

## 指令折叠

前面介绍的指令书写方式，是按照每条指令占一行的格式来书写。除此之外，还可以使用 S-表达式 的方式书写，方法就是使用括号嵌套折叠。例子如下：

``` wat
i32.const 13
get_local $x
i32.add
;; 与上面等价
(i32.add (get_local $x) (i32.const 13))
```

上面例子看出，折叠后的执行顺序按照从里到外、从左到右执行。可读性也比原来要好一点点。

对于指令块(如`block`/`loop`等)，也是可以折叠的，折叠后无需再写对应的 `end` 指令。例子如下：

``` wat
block $lable_1 (result i32)
  i32.const 13
  get_local $x
  i32.add
end
;; 与上面等价
(block $lable_1 (result i32) (i32.add (get_local $x) (i32.const 13)))
```

注意，指令折叠只是**语法糖**，过度使用反而会影响可读性，**不要滥用**。

</br>
</br>

# 指令参考

## 数据声明

- `i32`: 32 位整型数。
- `i64`: ...
- `f32`: 32 位浮点数， IEEE 754 标准。
- `f64`: ...

## 常数指令

- `i32.const x`: 在栈上压入值为 `x` 的 i32 。
- `i64.const x`: ...
- `f32.const x`: ...
- `f64.const x`: ...

## 算术运算指令

算术指令的返回值会在计算后压入栈内，返回值类型与指令的前缀有关，如 `i32.add` 就是得到 i32 类型的值。

- `i32.add`: i32 求**和**。从栈顶依次弹出两个 i32 的值，并求和，然后压入栈中。
- `i32.sub`: i32 求**差**。...。如`(i32.sub (i32.const 42) (i32.const 13))`的结果为 29 。
- `i32.mul`: i32 求**积**。...
- `i32.div_s`: i32 有符号求**商**。...
- `i32.div_u`: i32 无符号求商。...
- `i32.rem_s`: i32 有符号求**余**。...
- `i32.rem_u`: i32 无符号求余。...

- (`i64` 与 `i32` 的方法相同，不再赘述。)

- `f32.abs`: f32 求**绝对值**。从栈顶弹出 1 个 f32 的值，将其符号位改为 0 后压入栈。
- `f32.neg`: f32 **求反**。...
- `f32.ceil`: f32 **向上取整**。...
- `f32.floor`: f32 **向下取整**。...
- `f32.nearest`: f32 **四舍五入**取整。...
- `f32.trunc`: f32 **舍弃小数点**后的值。...
- `f32.sqrt`: f32 求**平方根**。...
- `f32.add`: f32 求**和**。从栈顶依次弹出 2 个 f32 的值，并求和，然后压入栈中。
- `f32.sub`: f32 求**差**。...
- `f32.mul`: f32 求**积**。...
- `f32.div`: f32 求**商**。...
- `f32.min`: f32 取**最小值**。从栈顶弹出 2 个 f32 的值，取较小者压入栈。若任一值为 NaN ，则结果为 NaN 。对指令来说 -0 小于 +0 。
- `f32.max`: f32 取**最大值**。...
- `f32.copysign`: 从栈顶依次弹出 2 个 f32 的值，第 1 个值的符号和第 2 个值的数字部分组合成新的 f32 ，压入栈。如`(f32.copysign (f32.const -1.1) (f32.const 2.2))`的结果为 -2.2 。

- (`f64` 与 `f32` 的方法相同，不再赘述。)

## 位运算指令

位运算指令的返回值会在计算后压入栈内，返回值类型与指令的前缀有关，如 `i32.clz` 就是得到 i32 类型的值。

- `i32.clz`: 从栈顶弹出 1 个 i32 的值，计算该值的二进制的**最高位开始**，**连续为 0 的位数**，将该"位数"压入栈。
- `i32.ctz`: ......**最低位开始**......
- `i32.popcnt`: 从栈顶弹出 1 个 i32 的值，计算该值的**二进制值为 1 的位数**，将该"位数"压入栈。
- `i32.and`: i32 **按位与**。从栈顶依次弹出 2 个 i32 的值，分别为 a 、 b ，计算 `a&b` 后压入栈。
- `i32.or`: i32 **按位或**。...
- `i32.xor`: i32 **按位异或**。...
- `i32.shl`: i32 **左移**。从栈顶依次弹出 2 个 i32 的值，分别作为"左移的位数"和"被左移的值"，得到的值压入栈。
- `i32.shr_s`: i32 **数学右移**(符号位不变)。从栈顶依次弹出 2 个 i32 的值，分别作为"左移的位数"和"被左移的值"，得到的值压入栈。
- `i32.shr_u`: i32 **逻辑右移**(连同符号位一起移动)。...
- `i32.rotl`: i32 **循环左移**。从栈顶依次弹出 2 个 i32 的值，分别作为"循环左移的位数"和"被循环左移的值"，得到的值压入栈。
- `i32.rotr`: i32 **循环右移**。...

- "循环*移"有点复杂，这里简单介绍：
  - 以 8 位二进制的值为例 `01111011` ，先给出答案，循环左移 2 位后的结果是 `11101101`
  - 第一步，先保留左移导致丢失的 2 位，即 `01` ，记作 a ；
  - 第二步，左移目标值，低位用 0 补全，得到 `11101100` ，记作 b ；
  - 计算 `a&b` 得到结果，即 `11101101`
  - 总结：其实就是把"低n位"和剩余的拆开，把两部分的位置交换。

- (`i64` 与 `i32` 的方法相同，不再赘述。)

## 变量访问指令

- `get_local x`: 将**局部变量** `x` 压入栈。 `x` 可以是变量索引，也可以是变量别名。
- `set_local x`: 从栈顶弹出 1 个值，并存入**局部变量** `x` 中。...
- `tee_local x`: 从栈顶**获取**(不弹出) 1 个值，并存入**局部变量** `x` 中。...
- `get_global x`: ... **全局变量** ...
- `set_global x`: ... **全局变量** ...

## 内存访问指令

分两部分介绍，分别是 `load*` 用于读取； `store*` 用于写入。

内存读取：

- `i32.load offset=o align=a`: 从栈顶弹出 1 个 i32 的值，记作 addr ，从内存的 addr+o 偏移处读取 1 个 i32 的值并压入栈。 o 为偏移值，可选参数，默认为 0 ； a 为地址对齐值，可选参数，取值为 1、2、4、8 ，默认为 4 。
- `i64.load offset=o align=a`: ...... (a 默认为 8)
- `f32.load offset=o align=a`: ......
- `f64.load offset=o align=a`: ...... (a 默认为 8)

- `i32.load8_s offset=o align=a`: 从栈顶弹出 1 个 i32 的值作为起始地址偏移值，记作 addr ，从内存的 addr+o 偏移处读取 1 个字节(8位) 的值，并**按有符号整数填充**剩余的高位，然后压入栈。... (a 默认为 1)
- `i64.load8_s offset=o align=a`: ...... (a 默认为 1)
- `i32.load16_s offset=o align=a`: ...... 读取 2 个字节(16位) ...... (a 默认为 2)
- `i64.load16_s offset=o align=a`: ...... 读取 2 个字节(16位) ...... (a 默认为 2)
- `i64.load32_s offset=o align=a`: ...... 读取 4 个字节(32位) ...... (a 默认为 4)

- `i32.load8_u offset=o align=a`: 从栈顶弹出 1 个 i32 的值作为起始地址偏移值，记作 addr ，从内存的 addr+o 偏移处读取 1 个字节(8位) 的值，并**按无符号整数填充**剩余的高位，然后压入栈。... (a 默认为 1)
- `i64.load8_u offset=o align=a`: ...... (a 默认为 1)
- `i32.load16_u offset=o align=a`: ...... 读取 2 个字节(16位) ...... (a 默认为 2)
- `i64.load16_u offset=o align=a`: ...... 读取 2 个字节(16位) ...... (a 默认为 2)
- `i64.load32_u offset=o align=a`: ...... 读取 4 个字节(32位) ...... (a 默认为 4)

内存写入：

- `i32.store offset=o align=a`: 从栈顶依次弹出 1 个 i32 的值，记作 value ；和 1 个 i32 的值作为起始地址偏移值，记作 addr ，从内存的 addr+o 偏移处写入 value 。... (a 默认为 4)
- `i64.store offset=o align=a`: ...... 弹出 1 个 i64 的值 ...... (a 默认为 8)
- `f32.store offset=o align=a`: ...... 弹出 1 个 f32 的值 ...... (a 默认为 4)
- `f64.store offset=o align=a`: ...... 弹出 1 个 f64 的值 ...... (a 默认为 8)

- `i32.store8 offset=o align=a`: 从栈顶依次弹出 1 个 i32 的值，记作 value ；和 1 个 i32 的值作为起始地址偏移值，记作 addr ，从内存的 addr+o 偏移处写入 value 的低 8 位，其他用 0 填充。... (a 默认为 1)
- `i64.store8 offset=o align=a`: ...... 弹出 1 个 i64 的值 ...... (a 默认为 1)
- `i32.store16 offset=o align=a`: ...... 弹出 1 个 i32 的值 ....... 写入 value 的低 16 位 ...... (a 默认为 2)
- `i64.store16 offset=o align=a`: ...... 弹出 1 个 i64 的值 ....... 写入 value 的低 16 位 ...... (a 默认为 2)
- `i64.store32 offset=o align=a`: ...... 弹出 1 个 i64 的值 ....... 写入 value 的低 32 位 ...... (a 默认为 4)

- `memory.size`: 把当前容量压入栈。值的类型为 i32 ，单位是页(1页=64KB)。
- `memory.grow`: 假设当前容量的值为 c ，从栈顶弹出 1 个 i32 的值 v 作为增加的容量(单位:页)，即把内存扩容为 c+v 。若成功，将 c 压入栈；否则将 -1 压入栈，两个值都是 i32 。

## 比较指令

比较指令得到的只有两种可能： 0 或 1 ，都是 i32 。

- `i32.eqz`: 判断值是否为 0 。从栈顶弹出 1 个 i32 的值，若该值为 0 ，则在栈中压入 1 ；否则压入 0 。
- `i32.eq`: 比较是否相等。从栈顶弹出 2 个 i32 的值，若两者相等，则在栈中压入 1 ；否则压入 0 。
- `i32.ne`: 比较是否不相等。...
- `i32.lt_s`: 比较两个有符号整数，是否前者更小。...
- `i32.lt_u`: ... 无符号 ... 前者更小。...
- `i32.gt_s`: ... 有符号 ... 前者更大。...
- `i32.gt_u`: ... 无符号 ... 前者更大。...
- `i32.le_s`: 比较两个有符号整数，是否前者小于等于后者。...
- `i32.le_u`: ... 无符号 ... 前者小于等于后者。...
- `i32.ge_s`: ... 有符号 ... 前者大于等于后者。...
- `i32.ge_u`: ... 无符号 ... 前者大于等于后者。...

- (`i64` 与 `i32` 的方法相同，不再赘述。)

- `f32.eq`: 比较是否相等。从栈顶弹出 2 个 f32 的值，若两者相等，则在栈中压入 1 ；否则压入 0 。
- `f32.ne`: 比较是否不相等。...
- `f32.lt`: ... 前者更小。...
- `f32.gt`: ... 前者更大。...
- `f32.le`: ... 前者小于等于后者。...
- `f32.ge`: ... 前者大于等于后者。...

- (`f64` 与 `f32` 的方法相同，不再赘述。)

说明一下，上面说的"前者"和"后者"都是按照弹出栈的顺序。

## 类型转换指令

- `i32.warp/i64`: 从栈顶弹出 1 个 i64 的值，把低 32 位的值压入栈。
- `i32.trunc_s/f32`: 从栈顶弹出 1 个 f32 的值，向 0 取整(即只保留整数部分)，作为有符号 i32 压入栈。(若取整后超过 i32 的容量会抛出运行时错误)
- `i32.trunc_u/f32`: ...... 作为无符号 i32 ......
- `i32.trunc_s/f64`: ... 弹出 1 个 f64 ... 作为有符号 i32 ......
- `i32.trunc_u/f64`: ... 弹出 1 个 f64 ... 作为无符号 i32 ......

- `i64.extend_s/i32`: 从栈顶弹出 1 个 i32 的值，按有符号整数扩展为 i64 (即符号位移到最高位,其他按0填充) 压入栈。
- `i64.extend_u/i32`: 从栈顶弹出 1 个 i32 的值，按无符号整数扩展为 i64 (即符号位的位置不变,高位填充0) 压入栈。
- `i64.trunc_s/f32`: ......
- `i64.trunc_u/f32`: ......
- `i64.trunc_s/f64`: ......
- `i64.trunc_u/f64`: ......

- `f32.convert_s/i32`: 从栈顶弹出 1 个 i32 的值，将其视为有符号整型，然后转为最接近的 f32 型的值后压入栈。过程可能会丢失精度。
- `f32.convert_u/i32`: ... 弹出 1 个 i32 ... 无符号 ...... 。
- `f32.convert_s/i64`: ... 弹出 1 个 i64 ... 有符号 ...... 。
- `f32.convert_u/i64`: ... 弹出 1 个 i64 ... 无符号 ...... 。
- `f32.demote/f64`: 从栈顶弹出 1 个 f64 的值，将其视为有符号整型，然后转为最接近的 f32 型的值后压入栈。过程可能会丢失精度或溢出。

- `f64.convert_s/i32`: ......
- `f64.convert_u/i32`: ......
- `f64.convert_s/i64`: ......
- `f64.convert_u/i64`: ......
- `f64.promote/f32`: ......

- `i32.reinterpret/f32`: 从栈顶弹出 1 个 f32 的值，将其按原位转为 i32 后压入栈。
- `i64.reinterpret/f64`: ... f64 ... i64 ... 。
- `f32.reinterpret/i32`: ... i32 ... f32 ... 。
- `f64.reinterpret/i64`: ... i64 ... f64 ... 。

## 控制流指令(略)

详看上面的 [控制流指令](#控制流指令) 。

## 其他指令

- `unreachable`: 触发异常，抛出 `WebAssembly.RuntimeError` 。
- `nop`: 什么也不做。
- `drop`: 从栈顶弹出 1 个值，无视类型
- `select`: 依次从栈顶弹出 3 个值，若首个值不为 0 ，则将第 3 个值压入栈；否则将第 2 个值压入栈。第 1 个必须为 i32 ，第 2/3 的值类型必须相同。

</br>
</br>
