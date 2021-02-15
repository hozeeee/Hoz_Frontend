
# 准备

## [1] 安装

1. 安装 nodeJS：官网有安装包
2. 全局安装 `typescript`：**`npm i typescript -g`**

</br>
</br>

## [2] 编译

控制台使用`tsc *.ts`可以把 **.ts** 文件，在相同的路径下，编译成 **.js** 文件。

</br>
</br>

## [3] TypeScript 与 JavaScript 的类型对比

| ES6 的数据类型 | TypeScript 的数据类型 |
|:--------------:|:---------------------:|
|    Boolean     |        Boolean        |
|     String     |        String         |
|     Number     |        Number         |
|     Array      |         Array         |
|    Function    |       Function        |
|     Object     |        Object         |
|     Symbol     |        Symbol         |
|      null      |         null          |
|   undefined    |       undefined       |
|                |         void          |
|                |          any          |
|                |         never         |
|                |         元组          |
|                |         enum          |
|                |       高级类型        |

可以看出， TypeScript 涵盖了 JavaScript 的数据类型。

</br>
</br>

## 其他

+ 如果有 **单元测试**的需求，使用 Jest ，请额外安装 `ts-jest` 。

+ typescript 与 ESLint ：
  + typescript 负责： 类型检测、语言转换、语法错误提示
  + ESLint 负责： 语法错误提示、代码风格
  + 两者并不冲突，推荐使用官方插件 `typescript-eslint`

+ `ts-node` 可以直接执行 ts 文件。

+ 我们使用某些 js 库时，可能没有自带 ts 声明文件，这时候可以到 [http://microsoft.github.io/TypeSearch/](http://microsoft.github.io/TypeSearch/) 寻找对应的声明文件。

+ 快速启动一个 typescript 项目。 GitHub 地址：[typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)。

</br>
</br>
</br>

# 基本语法

## [1] 声明

### [a] 变量声明

声明变量的方式基本都是`[变量名]:[类型]`，如下：

``` ts
let str: string = 'aaa';
```

#### 一个小坑

在全局作用域下使用 `let` 声明变量，会提示 ***无法重新声明块范围变量“...”*** 语法错误，只需要改成用 `var` 声明即可。

</br>

### [b] 函数声明

函数声明和变量声明也是类似的，指明函数返回的数据类型，无返回则为 `void` ，但指明类型的位置在 "`{`" 前，如下：

``` ts
// 普通函数
function fn1(a: string, b: number): string {
  return 'aaa'
}
// 箭头函数
let fn2: (a: string, b: number) => string = (a, b) => {
  return 'bbb'
}
// 匿名函数
let fn3 = function (a: string, b: number): string {
  return 'ccc'
}
```

说到函数，顺带说以下 `this` 。`this` 的指向只 `JavaScript` 必须熟悉的，在 `typescript` 中，可以指定 `this` 的类型，一般把它指定为 `void` 表示不使用 `this` 关键字。例子如下：

``` ts
// this 指定类型放在参数的第一位。且并不会影响函数的传参顺序
function fn(this: void, prop: string): void {
  console.log(prop)
}
fn('aaa');  // 'aaa'
```

</br>

### [c] TS 提供的类型

`typescript` 提供了如枚举、接口、类等的类型，声明它们，我们需要额外理解。

``` ts
// 枚举
enum Color{red, green, black}
// 接口
interface LabelledValue {
  label: string;
}
// 类(和 ES6 基本一致)
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

这里先简单介绍声明的语法，后面详细讲解用法。

</br>
</br>

## [2] 基本类型

布尔(`Boolean`)、数值(`Number`)、字符串(`String`)、数组(`Array<T>`)、标志(`Symbol`)、对象(`Object`)是 `JavaScript` 原有的，就不再赘述。

### [a] 数组

数组还是需要说一下，对于`typescript`来说，数组元素的类型都必须是相同的，这与`JavaScript`有点不同。表示方式有几种：

+ **number[]**  表示全是数字的**数组**，其他类型同理
+ **Array\<number>** 同样表示全是数字的数组
+ **ReadonlyArray\<number>** 表示全是数字的 ***只读*** 数组。需要注意的是，只读数组是普通数组的子集，即普通数组可以赋值给只读数组(声明期间)，但反过来则不行。

</br>

### [b] 元组(Tuple)

元组是数组的变形，表示一个**已知元素数量**和**类型**的数组，各元素的类型不必相同。当赋值越界元素时，会使用**联合类型**判断值的合法性。表示方式如下：

`[string, number]`：表示第一个元素是字符串，第二个元素的数字。（注意，**3.0** 之后的的版本，访问越界元素会报错）

</br>

### [c] 枚举(enum)

枚举元素编号默认从 0 开始，默认后一个元素会自增 1 。枚举元素编号可以是字符串，但后面的元素必须指明编号，编号不能重复。枚举声明如下：

``` ts
enum Color {Red, Green, Blue}
// 以下是错误的
enum Color {Red, Green = 'green', Blue}
```

我们可以通过编号获取值，也可以通过值获取编号。如下：

``` ts
enum Color { red, green = 'aaa', black = 1 }
console.log(Color.green); // 'aaa'
console.log(Color[1]);    // 'black'
```

但我们一般并不关心其对应值。枚举类型主要的用于在于*限制某个变量的值范围*，规定该变量只能是枚举值中的一个。用法如下：

``` ts
enum Color { red, green = 'aaa', black = 1 }
var my_color: Color = Color.green;
// 以下会导致报错，即使值是 Color 内含有的
my_color = 'aaa';
```

</br>

### [d] Any

`any` 表示"任何类型"，当你不清楚变量的类型时可以使用。当变量声明为 `any` 时，与写 `JavaScript` 就没什么两样了。而且要注意，`any` 的变量能赋值给任意类型的变量。如下：

``` ts
var my_any: any = 1
var str: string = 'aaa'
str = my_any;   // 这并不会报错
```

所以并不建议滥用 `any` 类型。

</br>

### [e] 针对函数声明的 `Void` 和 `Never`

当函数**没有返回值**时，使用 `void` 声明函数，作用并不大。当函数**不会执行完毕**时，使用 `never` 声明函数。（函数因报错或死循环导致不能执行完，都属于 `never` 类型）例子如下：

``` ts
function fn1(): void {
  // 没有返回
}
function fn2(): never {
  while (true) { }
}
function fn3(): never {
  throw new Error()
}
```

</br>

### [f] Null 和 Undefined

`null` 和 `undefined` 是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给其他有效类型的变量，反过来则不行。如下：

``` ts
var nothing1: undefined = null
var nothing2: null = undefined
var str1: string = nothing1
var str2: string = 'aaa'
// 以下会报错
nothing2 = str2
```

</br>

### [g] 其他

除了以上介绍的，接口(`interface`)、类(`class`)都是可以在声明时指定的类型。

</br>
</br>

## [3] 类型断言

当我们比 `typescript` 更了解变量的类型时，可以使用**类型断言**，有点类似其他语言的"类型转换"功能。使用前缀`<T>`或使用`as`关键字。语法如下：

``` ts
var someValue: any = "this is a string";
// "前缀"语法
var strLength1: number = (<string>someValue).length;
// as 关键字
var strLength2: number = (someValue as string).length;
```

类型断言除了作用域基本类型外，还能对接口、类、枚举使用。

还有一种断言，就是对含有 `null` 或 `undefined` 的联合类型断言为非空。使用的关键字是 `!` ，但是在变量名的后面添加。语法如下：

``` ts
// 使用 tsc *.ts --strictNullChecks 编译时，会报错，因为返回的值可能为空
function fn1(arg: string | undefined): string {
  return arg
}
// 通过编译，断言为非空
function fn2(arg: string | undefined): string {
  return arg!
}
```

</br>
</br>

## [4] 类型推断

**类型推断**并不是语法，是 `typescript` 提供的功能。当我们像 `JavaScript` 那样声明变量时，ts 就会默默给该变量指定合适的类型，下次再对该变量赋值时就会对其类型检查。例子如下：

``` ts
var somevalue = 'aaa'
// 报错，不是 string 类型
somevalue = 1111
```

</br>
</br>

## [5] 类型兼容

"类型兼容"发生在赋值时，如将`b`赋值给`a`，那么`a`的类型必须兼容`b`，否则会报错。

**函数**的兼容性：

+ 参数个数。
  + 在 `tsconfig.json` 配置文件中， 将 `"strictFunctionTypes"` 属性设为 `false` ，将允许函数参数的"双向协同"。
  + 所谓的"双向协同"，就是被赋值的函数的参数类型与赋值方的参数类型可以相互兼容，而非默认的只是"赋值方"兼容"被赋值方"。
+ 参数类型(与对象兼容性相反)。
+ 返回值类型(与对象兼容性相同)。

注意，**枚举类型**之间**不兼容**，即使元素相同。

**类**的兼容性：

+ 构造函数和静态属性是不参与对比；
+ 非继承关系的私有成员是不兼容的，即使是同名。

总结：

+ 结构之间兼容：成员少的兼容成员多的；
+ 函数之间兼容：参数多的兼容参数少的。

</br>
</br>
</br>

# 接口(`interface`)的介绍

在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。接口并非"数据实体"，没有实际的值，只规定了数据结构及值的类型。

在接口内，可以指定 ***可选属性(`?`)*** 和 ***只读属性(`readonly`)*** ，两个都是字面意思。

## [1] 用于描述**对象**

### [a] 一般用法

指定接口声明的对象必须满足接口的要求，不能使用接口规定以外的"`key`"值。如下面例子：

``` ts
interface RectConfig {
  color: string;
  width?: number;   // 可选属性
  readonly height: number;   // 只读属性
}
var myRect: RectConfig = {
  color: '#aaa',
  width: 100,
  height: 200
}
// 正确，因为 width 为可选属性
var myRect1: RectConfig = {
  color: '#aaa',
  height: 200
}
// 错误，因为含有意外属性 widthh
var myRect2: RectConfig = {
  color: '#aaa',
  widthh: 100,
  height: 200
}
// 错误，只读属性不能被修改
myRect.height = 300
```

</br>

### [b] 额外属性

当我们允许对象含有若干个未指定的"`key`"值时，可以使用"额外属性"。"额外属性"的"`key`"值只能是字符串或数值，**以字符串为"`key`"的**属性值类型必须是**以数值为"`key`"的**属性值类型的子类或同类。看如下例子：

``` ts
// 等效于数组，以数字为 key 值
interface RectConfig1 {
  [propName1: number]: any;
}
// 等效于普通 js 对象，以字符串为 key 值
interface RectConfig2 {
  [propName1: string]: any;
}
// 允许，因为数值能转化成字符串
interface RectConfig3 {
  [propName1: string]: any;
  [propName2: number]: string;
}
// 不允许，同类额外属性只能有一个
interface RectConfig4 {
  [propName1: string]: any;
  [propName2: string]: string;
}
```

</br>

### [c] 额外属性 + `readonly`关键字

额外属性还能与`readonly`关键字相结合，下面例子等效于**只读数组**：

``` ts
// 等效于 只读数组
interface RectConfig5 {
  readonly [propName: number]: any;
}
```

</br>
</br>

## [2] 用于描述**函数**

用于描述函数的接口，需要指定参数的类型及函数返回的值。值得注意的是，声明函数时，参数名可以与接口不一致，但类型顺序必须一致。

``` ts
// 定义接口
interface SearchFunc {
  (source: string, subString: string, other?: number): boolean;
}
interface SearchFunc {
  (source: string, subString: string, other?: number): boolean;
}
// 允许，声明函数时不会检查参数的个数及类型，但会检查函数的返回值
var fn: SearchFunc = function (src) {
  return false
}
// 另一种写法(注意开头加";"号)
;<SearchFunc>function fn1(src) {
  return false
}
// 允许，使用函数时会检查参数的个数及类型
fn('a', 'b');
// 不允许，第一个参数类型为字符串
fn(1, 'c');
```

</br>
</br>

## [3] 用于描述**类**

对于描述"类"的接口，里面包含属性和方法。需要两个接口，分别对应 **静态部分** 和 **实例部分**。声明类时，通过关键字 `implements` 实现接口。

### [a] 用于描述类的 **静态部分** 的接口

这类型的接口，用于提供给*类*一个"框架"，类必须包含接口中指定的方法和属性。*类*通过使用 `implements` 关键字使用接口。例子如下：

``` ts
interface ClockInterface {
  currentTime: Date;
  setTime(date: Date): void;
  otherFn?(arg: number): boolean;   // 可选方法
}
class Clock implements ClockInterface {
  constructor(h: number, m: number) { }
  currentTime = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}
```

可以看出，方法和属性的描述和上面提及的都一样。

</br>

### [b] 用于描述类的 **实例部分** 的接口

这类型的接口，一般用于把*类*的实例作为参数或属性时用到，即表示该变量是由某个类创建的实例。接上面的例子：

``` ts
// "类的实例"接口
interface ClockConstructor {
  new(hour: number, minute: number): ClockInterface;
}
// 作为函数参数的描述
function fn(cls: ClockInterface) {
}
fn(new Clock(1, 2))
// 作为属性的描述
let obj: {
  cls: ClockInterface
} = {
  cls: new Clock(3, 4)
}
```

</br>
</br>

## [4] 继承的接口

接口除了直接使用，还能通过继承获得。

### [a] 继承自别的接口

一个接口可以继承一个或多个的接口，使用 **`extends`** 关键字。例子如下：

``` ts
interface AInterface {
  a: string
}
interface BInterface {
  b: number
}
// 继承两个接口，多个接口之间用逗号分割
interface MergeInterface extends AInterface, BInterface {
  foo: any
}
```

</br>

### [b] 继承自类

接口除了能继承接口，还能**继承类**。继承自类的接口也只用于声明类，一般用于创建类时规定其必须继承自带有某些私有属性的类。直接给出官方的例子：

``` ts
class Control {
  private state: any;
}
interface SelectableControl extends Control {
  select(): void;
}
class Button extends Control implements SelectableControl {
  select() { }
}
class TextBox extends Control {
  select() { }
}
// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
  select() { }
}
class Location { }
```

</br>
</br>

## [5] 混合类型的接口

混合类型的接口，即可以用于描述对象，也可以用于描述函数。直接给出官方例子：

``` ts
interface Counter {
  // 为函数提供的
  (start: number): string;
  // 为对象提供的
  interval: number;
  reset(): void;
}
// 使用接口
function getCounter(): Counter {
  let counter = <Counter>function (start: number) { };
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}
```

</br>
</br>
</br>

# 类

类的概念在 ES6 已经有了，与之相同就不过多赘述。TS 的类使用接口也在上面讲解了。

## [1] TS 与 JS 的类的不同点

1. JS 并没有 `public` 、 `private` 、`protected` 、 `abstract` 的关键字。

2. JS 并没有"**抽象类**"的概念。

3. TS 类中可以使用 `readonly` 关键字定义**只读成员**。

4. JS 中的类成员可以直接在 `constructor` 构造函数中添加，即 `this.*` 设置成员；但 TS 必须先声明成员，否则在构造函数中直接创建成员会提示错误。如下例子：

     ``` ts
      // JS 中是允许的
      class Test1 {
        constructor() {
          this.prop = ' '
        }
      }
      // TS 的写法
      class Test2 {
        prop: string
        constructor() {
          this.prop = ' '
        }
      }
      ```

5. 存取器的写法

    ``` ts
    class Employee {
      private _fullName: string;
      // 当只有 get 方法时，被认为只 readonly
      get fullName(): string {
        return this._fullName;
      }
      set fullName(newName: string) {
        this._fullName = newName
      }
    }
    ```

</br>
</br>

## [2] `static` 、 `public` 、 `private` 、 `protected` 、 `abstract`

除了 `static` 都是 TS 提供的关键字。

+ 类成员默认就是 `public` ，即公共成员，类的实例对象可以直接访问。

+ `private` 表示成员为私有的，类的**实例对象不能访问**，**其衍生类也不能访问**，其衍生类的实例同样不能访问。还有，其衍生类不能使用私有成员的名字，否则提示"错误扩展"。

    ``` ts
    class A {
      private prop1: string = 'aaa'
      private prop2: string = 'bbb'
    }
    class B extends A{
      test(){
        // 错误，私有成员不能继承
        console.log(this.prop1)
      }
      // 错误，错误扩展基类
      private prop2: string = 'ccc'
    }
    ```

+ `protected` 表示成员为被保护的，类的实例对象同样不能访问，但**其衍生类可以访问**。

    ``` ts
    class A {
      protected prop: string = 'aaa'
    }
    class B extends A{
      test(){
        // 正确，保护成员可以被衍生类访问
        console.log(this.prop)
      }
    }
    ```

+ `static` 表示成员为静态的，即类的**实例对象不能访问该属性**，只能是类本身可以访问该属性。还有，静态成员可以被继承。

    ``` ts
    class A {
      static prop: string = 'aaa'
    }
    class B extends A {
    }
    // 正确，静态成员可以被继承
    console.log(B.prop)
    ```

+ `abstract` 表示成员为抽象的。所谓的抽象，就是像接口那样的定义成员，一般不提供具体实现方式(也可以提供)，必须通过继承来实现。要注意的是，`abstract`成员的类，必须在`abstract`类中。`abstract` 还可以配合 `protected` 使用。看如下例子：

  ``` ts
  abstract class Animal {
    abstract makeSound(): void;
    protected abstract prop1: string;
    move(): void {
      console.log('roaming the earch...');
    }
  }
  ```

</br>
</br>
</br>

# 泛型

## [1] 一般用法

泛型指的是把类型作为形参，其内部会多次使用该类型，在实际调用时再指定具体某个类型。使用"**类型变量**"的称为泛型，一般用于函数、类、接口。需要注意的时，这些类型变量代表的是任意类型，某些类型特有的方法会被提示错误。几种泛型语法如下：

``` ts
// 泛型函数
function fn<T>(a: T): T {
  return a
}
fn<number>(1)
fn('aaa')
// 泛型类
class Cls<U>{
  prop: U
}
let cls = new Cls<number>()
// 泛型接口
interface Itf1 {
  <T>(arg: T): T;
}
interface Itf2<Z> {
  (arg1: Z, arg2: Z): Z;
  prop: Z
}
```

</br>
</br>

## [2] 泛型约束

1. 我们还能对泛型进行约束，使用 `extends` 关键字可以指明泛型是那种类型的衍生。例子如下：

    ``` ts
    interface Lengthwise {
      length: number;
    }
    // 指明泛型是包含 length 属性的
    function loggingIdentity<T extends Lengthwise>(arg: T): T {
      console.log(arg.length);
      return arg;
    }
    ```

2. 对对象的键值约束。使用的语法是 `* extends keyof *` 。例子如下：

    ``` ts
    function fn<T, K extends keyof T>(obj: T, key: K) { }
    fn({ a: 1 }, 'a');
    // 报错，b 不是对象的属性
    fn({ a: 1 }, 'b');
    ```

3. 在泛型里使用类类型

    ``` ts
    class Animal {
      numLegs: number;
    }
    // 参数 c 必须是一个 可以实例化的类
    function create<T>(c: { new(): T; }): T {
      return new c();
    }
    create(Animal);
    // 另一个更高级的例子
    class Bee extends Animal {
      foo: string;
    }
    class Test{}
    function createInstance<A extends Animal>(c: new () => A): A {
      return new c();
    }
    createInstance(Bee);
    // 错误，Test 不是 Animal 的衍生类
    createInstance(Test);
    ```

    其中可能有两个写法存在疑问：

    + `c: { new(): T; }` 表示 c 使用匿名接口 `{ new(): T; }` 来定义，匿名接口的含义可以参考上面的"用于描述类的实例部分的接口"。
    + `c: new () => A` 表示 c 是一个可以实例化的函数，写法含义参考上面的"函数声明"的箭头函数声明。

</br>
</br>

## [3] 其他

需要注意的是，类的静态成员不能使用泛型。例子如下：

``` ts
class Foo<T>{
  // 静态成员不能引用类类型参数
  static prop: T
}
```

</br>
</br>
</br>

# 类型兼容

类型兼容表述的是两个变量之间能否赋值给对方。兼容的首要条件是赋值的变量需要包含被赋值变量的所有成员。

## [1] 函数(方法)

函数的赋值必须是匿名函数(`function`定义的函数之间不能赋值)。函数有两部分会做兼容检查：参数和返回值。且两部分都需要兼容才能赋值。

``` ts
let fn1: (str: string, num: number) => void
let fn2: (str: string) => void
let fn3: (str: string, num: number) => { str: string }
// 兼容
fn1 = fn2
// 报错，参数部分不兼容
fn2 = fn1
// 报错，函数返回部分不兼容
fn3 = fn1
```

</br>
</br>

## [2] 对象

对象的赋值必须是属性和方法都满足要求。`readonly` 关键字不会影响兼容性检查。

``` ts
// 对象中的属性
let obj1: { name: string }
let obj2: { readonly name: string, age: number }
// 报错，不兼容，obj2 的 age 成员是 obj1 所没有的
obj2 = obj1
// 兼容
obj1 = obj2
// 报错，obj2 的 readonly 不会被赋值过去
obj1.name = 'sss'
// 报错，obj1 的类型没变，即使赋值也不会增加其成员
obj1.age = 2
// 对象中的方法
let obj3: {
  (arg1: string, num: number): void
}
let obj4: {
  (arg2: string): void
}
// 兼容
obj3 = obj4
// 报错，方法部分不兼容
obj4 = obj3
```

</br>
</br>

## [3] 枚举

不同的枚举是不兼容的，即使两个枚举是一模一样。

``` ts
enum Color1 { Red, Blue, Green }
enum Color2 { Red, Blue, Green }
let color = Color1.Red
// 报错，枚举值是不兼容的，即使是相同值
color = Color2.Red
```

</br>
</br>

## [4] 类的静态和实例部分

类的兼容性总结以下几点：

+ 静态成员和构造函数不在比较的范围内。
+ 类的私有成员和受保护成员会影响兼容性，衍生类才能兼容私有成员和受保护成员。

### [a] 类的实例之间的赋值

**被赋值的类**的成员必须在**赋值的类**中都能找到，否则是"**不兼容**"。如下：

``` ts
class A {
  protected prop0: string
  private prop1: string
}
class B {
  protected prop0: string
  private prop1: string
}
class C extends B {
  protected prop2: string
  static prop3: string
}
class D extends C {
  prop34: string
}
class E {
  prop6: string
  static prop7:string
  prop8: string
}
class F {
  prop6: string
  static prop7:string
}
let aa = new A()
let bb = new B()
let cc = new C()
let dd = new D()
let ee = new E()
let ff = new F()
// 以下两种都不兼容，私有属性和保护属性即使同名也不兼容
aa = bb
bb = aa
// 兼容
bb = cc
// 兼容
cc = dd
// 不兼容
ee = ff
// 兼容，具有相同的公共属性
ff = ee
```

</br>

可以看出，父类一定兼容子类，反之则不是；保护成员和私有成员都是不兼容的；静态成员和公共成员都是兼容的。

### [b] 实例化类时的兼容性

直接看下面例子。

``` ts
class AClass {
  str: string;
}
class BClass {
  str: string;
  num: number;
}
// AClass兼容BClass，声明的aclass只有AClass中的属性
var aclass: AClass = new BClass();
// 错误，aclass 没有 num 成员
var val = aclass.num
```

</br>
</br>
</br>

# 高级类型

## [1] 交叉类型

交叉类型是将多个类型合并为一个类型，所以交叉类型拥有"被交叉"类型的任意成员。类似于把多个对象合并成一个对象。使用的运算符是 `&` 。例子如下：

``` ts
function fn<T, U>(obj1: T, obj2: U): T & U {
  return Object.assign(obj1, obj2);
}
```

</br>
</br>

## [2] 联合类型

联合类型可以理解为"或运算"，运算符是 `|` 。联合类型表示是"被联合"类型的其中一个。需要注意的是，只能访问此联合类型的所有类型里共有的成员。例子如下：

``` ts
function fn(arg: string | number) { }
fn(1);
fn('a');
// 报错，类型不是 string | number 中的一个
fn([]);
```

### 类型保护与区分类型

假设联合类型中，每个类型都有特定的方法，当我们需要特定方法时，却得不到语法提示或报错。虽然我们可以用类型断言解决这个问题，但我们有更好的解决办法。

``` ts
// 假设我们有两个接口，各自有特有的方法
interface Fish {
  swim: () => void
}
interface Bird {
  fly: () => void
}
// "类型保护"函数
function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
function fn(pet: Fish | Bird) {
  // 愉快的调用对应的方法
  isFish(pet) ? pet.swim() : pet.fly();
}
```

`typeof` 和 `instanceof` 也能作为"类型保护"，具体用法跟 JavaScript 相同。如果是"接口"类型，那就只能用上面的方法了。

</br>
</br>

## [3] is 关键字

使用谓词语法的好处的，编译器会提示返回值是 `arg is string` ，可以比较清晰的知道函数的作用是判断参数是否为某类型。函数实际是返回布尔值。语法如下

``` ts
function isString(arg: any): arg is string {
  return typeof arg === 'string'
}
```

</br>
</br>

## [4] 类型别名

顾名思义，就是为任意类型提供一个新的名字，甚至是基础类型，如`string`。关键字是 `type` 。需要注意的是类型别名不能被 `extends` 和 `implements`（自己也不能 `extends` 和 `implements` 其它类型）。语法如下：

``` ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
type Container<T> = { value: T };
// 类别名引用自身。适用于链表
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
}
```

</br>
</br>

## [5] 字符串字面量 与 数字字面量

字符串字面量类型其实类似于枚举，表示值只能是有限的字符串的一个。数字字面量同理。语法如下：

``` ts
type Strings = "ease-in" | "ease-out" | "ease-in-out";
type Nums = 1 | 101 | 1010
function fn(arg1: Strings, arg2: Nums) { }
fn('ease-in', 101);
// 报错，不是指定值中的一个
fn('aaa', 2);
```

</br>
</br>

## [6] 映射类型

映射类型是把已知类型的每个成员赋值到自身，可以将成员设为"可选"或只读等。使用的关键字是 `in keyof` 和 `type` 。语法如下

``` ts
interface SourceInterFace {
  name: string;
  age: number;
}
// 映射类型，功能是把所有成员都改为只读
type ChangeToReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
// 被转换后的新接口类型
type NewInterface = ChangeToReadonly<SourceInterFace>
```

</br>
</br>

## [7] 索引类型

使用索引类型，编译器就能够检查使用了动态属性名的代码。

``` ts
// 从对象中选取属性的子集
function pluck(o, names) {
  return names.map(n => o[n]);
}
// 通过 索引类型查询 和 索引访问操作符
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}
interface Person {
  name: string;
  age: number;
}
let person: Person = {
  name: 'Jarid',
  age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, string[]
```

有两个语法需要解释一下：

+ `keyof` ，**索引类型查询操作符**。如 `keyof T` 对于任何类型 `T`， `keyof T` 的结果为 `T` 上已知的公共属性名的联合。
+ `T[K]` ，**索引访问操作符**。如 `Obj["b"]` 就是成员 `b` 的类型。

``` ts
interface Obj{
  a: number,
  b: string
}
// key 的类型就是 "a"|"b"
let key: keyof Obj
// value 的类型就是 Obj.a 的类型，即 number
let value: Obj['a']
```

</br>
</br>

## [8] 条件类型

简单说就是通过"条件语句"创建的类型。看示例

``` ts
// Exclude (剔除交集)
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T02 = Exclude<string | number | (() => void), Function>;  // string | number
// Extract (提取交集)
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"
type T03 = Extract<string | number | (() => void), Function>;  // () => void
// NonNullable (剔除 null 和 undefined)
type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]
// 两个示例
function f1(s: string) { return { a: 1, b: s } }
class C { x = 0; y = 0; }
// ReturnType (获取函数返回值类型)
type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // any
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error
// InstanceType (获取构造函数类型的实例类型)
type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // any
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```

</br>
</br>
</br>

# 声明合并

对项目多处的**同名全局变量**声明，自动判断为同一个变量，其成员会被合并。

**命名空间(`namespace`)**、**模块**、**接口(`interface`)**、**枚举(`enum`)** 也可以发生合并。具体看下面关于 `declare` 关键字的一节。

而类(class)不能合并，但可以 **混入(Mixins)** 达到同样的效果。看下面官方的例子：

``` ts
// 两个类，用于被合并
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}
class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}
// 使用 implements ，而非 extends ，表示两个类以"接口"的形式被实现
// 以"接口"的形式实现意味着我们需要重新实现接口的成员，这不是我们想要的
class SmartObject implements Disposable, Activatable {
  constructor() {
    setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
  }
  interact() {
    this.activate();
  }
  // Disposable
  isDisposed: boolean = false;
  dispose: () => void;
  // Activatable
  isActive: boolean = false;
  activate: () => void;
  deactivate: () => void;
}
// 我们可以利用原型链，把"具体的方法"添加到原型对象上
applyMixins(SmartObject, [Disposable, Activatable]);
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
// 愉快的使用
let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
```

</br>
</br>
</br>

# 命名空间

## [1] 一般语法

当一个文件的变量越来越多，会有重名的危险，这时候可以使用命名空间。命名空间内的变量，在命名空间外是不能访问的。使用的关键字是 `namespace` ，若想让外部能访问到某些成员，需要 `export` 该成员。例子如下：

``` ts
namespace MyNamespace {
  export let value: string = 'aaa';
  let value1: string = 'ccc';
}
// 允许，两个 value 不冲突
let value: string = 'bbb';
// 访问命名空间内的属性
console.log(MyNamespace.value); // 'aaa'
// 错误，访问不到该属性
console.log(MyNamespace.value1);
```

</br>
</br>

## 别名

别名用于简化命名空间的操作，如为 `a.b.c` 提供别名 `x` 。使用的关键字是 `import` 。语法如下：

``` ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle { }
  }
}
import Triangle = Shapes.Polygons.Triangle;
let triangle = new Triangle();
```

</br>
</br>
</br>

# 模块化

导入导出的语法和 ES6 一致，都是使用 `import` 和 `export` 关键字。语法如下：

``` ts
// export.ts
export const value = 'aaa';

// import.ts
import { value } from './export'
console.log(value);   // 'aaa'
```

## [1] 支持传统的 CommonJS 和 AMD 的工作流模型的语法

为了支持 CommonJS 和 AMD 语法，typescript 还提供另外一种模块化语法，`export = *` 和 `import * = require('*')`。如下：

``` ts
// export.ts
const value: string = 'bbb'
export = { value }

// import.ts
import { value } = require('./export')
console.log(value);   // 'bbb'
```

</br>
</br>

## [2] "*.d.ts"文件与"declare"关键字

`"declare"` 可以简单理解为类似于声明接口。

利用"declare"和"命名空间合并"，为原有的模块添加成员：

``` ts
// 假设我们需要在 fs 模块上加上 foo 方法
import fs from 'fs';
// 在相同的命名空间下，成员会被合并
declare module "fs" {
  function foo(): String
}
// 我们可以为其添加 foo 方法
fs.foo = function(){
  return "baz"
}
```

`"declare"` 也可以放在一个单独的 `*.d.ts` 文件中。如果在同一目录下，则会自动检测并引用。

如两者不在同一个目录，可以通过 `import "*"` 引入指定声明文件。

</br>
</br>
</br>

# `interface` 和 `type` 的对比

虽然两者的用途可能会很类似，但需要明确：

+ `type`: 全称叫 type aliases ，它一般用于给[高级类型](#高级类型)添加别名，当然也可以用于其他类型的别名。
+ `interface`: 是接口，与其他语言的接口用途类似。在 typescript 可以用于描述方法或对象。

扩展：

+ `type`: 准确来说不叫扩展，是**类型合并**，可以查看[高级类型](#高级类型)的"交叉类"和"联合类型"。使用 `=`、`&`、`|` :

  ``` ts
  type MyType1 = {
    foo: String;
  };
  // 其实就是把新的高级类型赋值给一个新的别名
  type MyType2 = MyType1 & {
    baz: Number;
  }
  type MyType3 = MyType1 | {
    bao: String;
  }
  // 都是合法的
  let obj: MyType2 = { foo: "foo", baz: 1 }
  let obj2: MyType3 = { bao: "bao" }
  let obj3: MyType3 = { foo: "foo" }
  ```

+ `interface`: 扩展使用的是 `extends` 关键字。具体内容请看[interface](#接口\(`interface`\)的介绍)。

还有要注意， `interface` 可以发生命名合并，但 `type` 不会：

``` ts
interface IMyIF {
  foo: String;
}
interface IMyIF {
  baz: Number
}
// 重复声明会被合并
let obj4: IMyIF = { foo: "foo", baz: 1 }
```

</br>
</br>
</br>

# 配合 webpack 使用

## [1] 初始化、安装

``` shell
npm init --yes
npm i webpack webpack-cli typescript -D
npm i awesome-typescript-loader source-map-loader -D
```

其中，**`awesome-typescript-loader`** 可以让 Webpack 使用 TypeScript 的标准配置文件 tsconfig.json 编译 TypeScript 代码。

而 **`source-map-loader`** 使用 TypeScript 输出的 sourcemap 文件来告诉 webpack 何时生成自己的 sourcemaps 。

</br>
</br>

## [2] 配置 tsconfig.json

**tsconfig.json** 是 TypeScript 的配置文件。如下

``` json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react"
  },
  "include": [
      "./src/**/*"
  ]
}
```

</br>
</br>

## [3] 配置 webpack.config.js

**webpack.config.js** 是 Webpack 的配置文件。详细配置不具体解析，请移步到 Webpack 官网学习更多，这里主要关注的是 `input`、`output`、`module` 。如下：

``` js
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "awesome-typescript-loader"
    }, {
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    }]
  }
}
```

</br>
</br>

## [4] 执行打包

还需要在 package.json 内配置命令 `scripts.build = "webpack"` ，然后执行 `npm run build` 即可打包项目。当然了，这里说的都说最小配置。

</br>
</br>
</br>

# 与 VUE 结合

TODO: demo

</br>
</br>
</br>

# 与 React 结合

TODO: demo

tsx 的类型约束写法

``` tsx
interface Greeting {
  name: string,
  firstName: string,
  lastName: string
}
const Hello: React.FC<Greeting> = ({
  name,
  firstName,
  lastName
}) => (....)
export default Hello
```

`react-create-app <programName> --typescript`  基于 typescript 构建项目，其中项目中的配置文件在 `react-script` 依赖包中。
