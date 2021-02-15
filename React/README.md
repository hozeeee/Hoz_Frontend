
# 起步

## 基本概念

React 是视图层框架。 React 自身只负责数据和页面渲染。因为他在多层嵌套的组件结构中，通信传值是比较麻烦的，而 React 把这部风的工作交给了其他框架完成，如 Redux 。

React 是 "all in js" ，意思是所有的文件都可以引入到 js 文件中，如 css 文件，也可以通过 `import` 引入。

React 中是单向数据流，就是修改数据必须通过特定的方法。如，组件中修改 `state` 中的数据，必须通过 `setState()` 方法；子组件想修改父组件的数据，必须通过父组件提供的方法才可以。

</br>

## 脚手架

### create-react-app

[官网地址](https://www.html.cn/create-react-app/docs/getting-started/)。

`npm i create-react-app -g` 全局安装脚手架工具。

在存放项目的目录下，执行 `create-react-app <programName>` ，然后等待自动下载依赖即可。

在项目目录下，执行 `npm start` 即可启动项目。

### Umi

[链接](./Umi.md)。

### Dva

[链接](./DvaJs.md)。

</br>

## demo 简介

文中大部分内容都可以从 [demo](./0_react_demo) 中找到， demo 也包含大量注释方便理解。

</br>

## JSX 简介

JSX 是介于 `HTML` 和 `JS` 之间的一种语法，既不是 `HTML` ，也不是 `JS` 。一般通过特定的 `render` 函数返回，如下：

``` jsx
render() {
  // 注意 div 两边不需要引号，因为它不是字符串，
  // return 后的括号也可以省略
  // return 必须只有一个根元素 (若不想用实体元素包裹，可以引入 Fragment 组件作为占位符，用于包裹多个实体元素，Fragment不会渲染出实体元素)
  return (
    <div
      // JSX 中，元素的类名应该使用 className 代替 class ， 因为 class 会与 js 中的 class 关键字冲突
      className="my_input"
      // 和 Vue 不同，元素属性绑定数据时，不需要用引号包裹，直接 prop={...} 即可。
      value={this.state.inputValue}
      // 绑定事件 (注意，"on"后面的字母需要大写)
      // 事件监听器的参数与原生的一致，只有一个 event 对象
      // 默认情况下，监听器this指向全局对象(严格模式下是undefined)，可以使用.bind修改this指向
      onChange={this.handleInputChange}
      // 内联样式 (不能写成字符串的形式)
      style={{userSelect:"none",cursor:"pointer"}}
    >
      {/* 花括号内部就是 JS 代码，所以这样写注释也是没问题的 */}
      hello world
      <label
        // 同样是为了避免与 js 中的 for 关键字冲突
        htmlFor={myInputId}
      >label</label>
      <ul>
          {
            // 列表渲染 (这里直接使用 map 返回 JSX)
            this.state.list.map((item, index) => {
              return (
                // 渲染列表时，需要指定一个唯一的 key ，但不建议使用索引作为key值
                <li key={index}>{item}</li>
              )
            })
          }
        </ul>
      {/* 若我们不想对数据转义显示，可以使用 dangerouslySetInnerHTML.__html 指定元素中的 HTML 文本 */}
      <p dangerouslySetInnerHTML={{ __html: this.state.myHtmlText }}></p>
    </div>
  )
}
```

实际上，JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖。

如下 JSX 语法：

``` jsx
<MyButton color="blue" shadowSize={2}>Click Me</MyButton>
```

会编译为：

``` js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
);
```

</br>

## 组件的简单介绍

组件就是一个 js 文件，需要抛出一个构造函数，一般用"类"的语法书写。而引用组件也很简单， `import` 引入后，像普通元素一样在 JSX 中书写即可。

``` js
// 组件中即使没用到 React 对象上的属性，也要引入，否则会无法解析 JSX 语法
// 组件都需要继承自 Component 组件
import React, { Component, Fragment } from 'react';
// 组件的构造函数
class App extends Component {
  // 这是固定的写法 (默认都是接收父组件的属性传值)
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
    // 绑定组件中方法 this 的指向，否则 DOM 事件监听器的 this 会指向 undefined
    this.handleClick = this.handleClick.bind(this)
  }
  // 渲染函数 (每当 state 和 props 发生改变，此 render 函数都会被执行一次)
  render() {
    return (
      // 最外层必须只有一个根元素，若不想渲染出实体元素，可以使用 Fragment 组件作为占位符
      <Fragment>
        {/* 关于JSX的部分介绍，上面已经包含，这里不再赘述 */}
        <div>{this.state.count}</div>
        <button onClick={this.handleClick}></button>
        {/* 使用 this.props 可以读取父组件传递过来的数据 */}
        <div>{this.props.fromParentValue}</div>
        {/* 组件都以大写字母开头 */}
        <Child
          // 向子组件传值
          propName={this.state.toChildValue}
        />
      </Fragment>
    )
  }
  // 上面提到React是单向数据流，所以必须定义修改数据源的函数
  // 监听器的参数与原生的事件对象一致
  handleClick(e) {
    // 错误写法：不能直接对 state 里面的属性赋值
    // this.state.count = this.state.count.count + 1
    // 正确写法：调用组件中的 setState() 方法，传入需要修改的键值对
    this.setState({
      count: this.state.count + 1
    })
    // 新语法推荐下面写法，setState 传入一个函数，而非对象。注意，下面方法是一个异步执行的方法。
    /**
    // prevState 指的是原来的 state 对象
    this.setState(prevState => {
      return { count: prevState.count + 1 }
    }, _ => {
      // 第二个可选参数是一个函数，当真实DOM跟新后会被执行
    })
    */
  }
}
// 抛出组件的构造函数
export default App;
```

</br>

## 父子组件间通信

父组件给子组件传递数据，只需要通过"属性"传值即可。而子组件想修改父组件的数据，则需要先在父组件中定义一个修改数据的方法，再把方法传给子组件，子组件再调用该方法。

``` js
/* ----- 父组件 ----- */
class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [1, 2, 3]
    }
    // 绑定方法的this指向
    this.handleItemClick = this.handleItemClick.bind(this)
  }
  render() {
    return <div>
      {this.state.list.map((item, index) => {
        return <Child
          key={index}
          // "父"向"子"组件传递 数据
          content={item}
          index={index}
          // "父"向"子"组件传递 方法
          handleClick={this.handleItemClick}
        />
      })}
    </div>
  }
  handleItemClick(index) {
    let _list = [...this.state.list]
    _list[index]++
    this.setState({
      list: _list
    })
  }
}
/* ----- 子组件 ----- */
class Child extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  render() {
    return <div
      style={{userSelect:"none",cursor:"pointer"}}
      onClick={this.handleClick}
    >
      {/* "子"组件获取"父"组件的 数据 */}
      ------ {this.props.content} ------
    </div>
  }
  handleClick(e) {
    // "子"组件使用"父"组件提供的 方法
    this.props.handleClick(this.props.index)
  }
}
```

## 组件组合

这个与 Vue 的插槽(`slot`) 类似，但 React 并由有插槽的概念，原理是通过 `props` 传入组件。

容器组件：

``` jsx
import React, { Component } from "react";
// 这个组件只是作为"容器"
class ContainerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div style={{ margin: "10px", border: "2px solid #aaa" }}>
        {/* 默认 */}
        <div>{this.props.children}</div>
        {/* 还能通过 props 的其他属性插入 */}
        <div style={{ display: "flex", borderTop: "2px solid #aaa" }}>
          <div style={{ flex: 1, borderRight: "2px solid #aaa" }}>{this.props.leftContent}</div>
          <div style={{ flex: 1 }}>{this.props.rightContent}</div>
        </div>
      </div>
    )
  }
}
```

使用"容器"：

``` jsx
<ContainerBox
  leftContent={<span>通过 "props.*" 方式插入</span>}
  rightContent={<span>与左边相同</span>}
>
  <span>这部分内容默认会传到父组件的 "props.children" 属性中</span>
</ContainerBox>
```

</br>
</br>

# 理论

## 虚拟 DOM 理论

什么是 虚拟DOM ？

虚拟DOM 本质就是一个有特定结构的**JS对象**， React 在生成真实 DOM 的同时会创建一个 虚拟DOM ，每当数据发生改变都会生成新的 虚拟DOM ，然后与旧的 虚拟DOM 比对，最后针对性的修改 真实DOM 节点。

为什么要使用 虚拟DOM ？

因为对 真实DOM 节点的查询和修改都需要调用 DOM API ，非常耗费资源。但 虚拟DOM 本质是JS对象，查询和比对的速度非常快。

具体流程大致如下：

1. 定义 state (或 props ) 数据
2. 创建 JSX 模板
3. 数据与模板的结合，生成 虚拟DOM ，然后渲染 真实DOM
4. 当 state 的数据发生改变，生成新的 虚拟DOM
5. 新的 虚拟DOM 与旧的 虚拟DOM 比对，找到发生变化的节点 (**Diff算法**)
6. 针对比对结果，修改 真实DOM

### React 中对虚拟 DOM 的优化

1. 用函数作为 `setState()` 的参数的好处： 当我们以函数作为参数，`setState()`方法会以异步的方式执行。若我们在很短的时间内对数据进行多次的修改，`setState`会集中在一次渲染，以减少对真实 DOM 的操作。

2. 尽量不要使用数组的索引作为 `key` ： 列表节点的比对是基于 `key` 值进行的，若 `key` 值不发生变化，就不会对该节点重新渲染。使用数组索引作为`key`是不稳定的，当我们删除数组中的元素，后面元素的索引都会发生变化，即`key`也会发生变化，导致节点都重新渲染了。带来性能上的问题。

3. "同级比较"： 虚拟 DOM 节点比对时，"从上到下"，若上层的节点不同，下层就不会继续比对，整个节点的替换渲染，即使下面的节点完全一致。

</br>

## 生命周期

与 Vue 一样，有生命周期函数。所谓的生命周期函数，就是某个时刻组件会自动执行的函数。

``` txt
                    |                      |                                                      |                     |
  [Initialization]  |       [Mounting]     |                        [Updation]                    |    [Unmountiong]    |
                    |                      |          (props)                    (states)         |                     |
                    |  componentWillMount  |  componentWillReceiveProps                           |  componentDidMount  |
   (setup props     |         ↓            |             ↓                                        |                     |
      and state)    |       render         |    shouldComponentUpdate      shouldComponentUpdate  |                     |
                    |         ↓            |          |      ↓(false)           |      ↓(false)   |                     |
                    |  componentDidMount   |    (true)|      X            (true)|      X          |                     |
                    |                      |          ↓                         ↓                 |                     |
                    |                      |     componentWillUpdate        componentWillUpdate   |                     |
                    |                      |            ↓                           ↓             |                     |
                    |                      |          render                      render          |                     |
                    |                      |            ↓                           ↓             |                     |
                    |                      |     componentDidUpdate         componentDidUpdate    |                     |
                    |                      |                                                      |                     |
```

下面是要额外说明的：

- `componentWillReceiveProps` : 仅当 `props` 里面的值发生变化时才会触发。注意，首次挂载时并不会触发，因为那是属于 `Mounting` 阶段。

- `shouldComponentUpdate` : 这是唯一一个需要返回布尔值的生命周期函数。返回`true`时，表示允许更新页面，这也是默认值；当返回 `false` 时，则表示不允许更新页面。此函数也可以作为**性能优化的点**。首先我们要知道，当父组件的`render`函数执行时，子组件默认会更新(即执行了自己的 `render` 函数)， `shouldComponentUpdate` 含有有两个参数，分别是 `nextProps` 和 `nextState` ，通过比对将修改的值与当前的值，决定是否更新此组件。例子如下：

  ``` js
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.content !== this.props.content) return false
    return true
  }
  ```

- `componentDidMount` : 一般在此函数里**发起 AJAX 请求**。千万别在 `render` 函数内发起并修改 `state` 的数据，否则会导致死循环。

</br>
</br>

# 进阶内容

## PropTypes 类型检测

PropTypes 是应用于 React 的一个库，用于对 `props` 的类型检测。但这不是强制使用的。下面介绍基本用法。

``` js
import PropTypes from 'prop-types'
class App extends Component {
  // 略....
}
// 配置 PropTypes (注意写法,"App"是此组件名;"propTypes"是固定写法)
App.propTypes = {
  // 左边是属性名；右边是配置内容
  name: PropTypes.string,
  age: PropTypes.number.isRequired
}
// 配置默认值 (注意写法,"App"是此组件名;"defaultProps"是固定写法)
App.defaultProps = {
  // 左边是属性名；右边是默认值
  name: 'zhangsan'
};
```

具体的配置内容，请查阅 [中文官网](https://www.reactjscn.com/docs/typechecking-with-proptypes.html) (英文官网时效性更高)。除此之外， TypeScript 也能做到类型检测，那就是另外一个话题了 (TypeScript+React的开发方式)。

</br>

## 懒加载

直接上代码：

``` js
// 懒加载依赖 Suspense 和 lazy
import React, { Component, Fragment, Suspense, lazy } from 'react';
// 使用 懒加载 方式加载组件
const LazyComp = lazy(() => import('./LazyComp.jsx'));
class App extends Component {
  // ....
  render() {
    return (
      // ....
      {/* 懒加载组件必须用 Suspense 包裹，且必须提供 fallback 属性，作为优雅降级的显示 */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Suspense 内可以有多个懒加载的组件 */}
        {this.state.showLazyComp && <LazyComp />}
      </Suspense>
      // ....
    )
  }
}
```

需要注意的是， `lazy` 只支持默认导出，若组件是以命名导出，可以创建一个中间模块，重新导出为默认导出：

``` js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

</br>

## 使用 Context

Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。避免了组件多层嵌套的情况下，每次都要把值传给下一层子组件。例如这样的一个场景，定了两套风格的样式，高亮和暗黑，特定或所有的组件都需要用到。

这里不花时间介绍了，对于这种跨多个组件的通信，常用的方案是使用 `redux` 。

具体示例请在 [demo](./0_react_demo) 中寻找，详细文档请查阅 [官网](https://reactjs.bootcss.com/docs/context.html) 。

</br>

## 使用 Portals

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

一个 portal 的典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框。

简单说就是， `createPortal()` 可以把元素挂载到特定的元素上，如 `body` 。但被挂在的元素的事件冒泡依然会传递到"父组件"上。

具体请看 [demo](./0_react_demo) 的 `TestPortals.jsx` 代码。

</br>

## 使用 Profiler

Profiler 测量渲染一个 React 应用多久渲染一次以及渲染一次的“代价”。

注意， Profiling 增加了额外的开支，所以它在生产构建中会被禁用。

具体请看 [demo](./0_react_demo) 的 `TestProfiler.jsx` 代码。

</br>

## 错误边界

如果一个 `class` 组件中定义了 `static getDerivedStateFromError()` 或 `componentDidCatch()` 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。

错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出**备用 UI** ，而不是渲染那些崩溃了的子组件树。

错误边界在**渲染期间**、**生命周期方法**和整个组件树的**构造函数**中捕获错误。

注意，错误边界**无法捕获**以下场景中产生的错误：

- 事件处理 （如点击监听器抛出的错误）
- 异步代码 （如 setTimeout 或 requestAnimationFrame 回调函数）
- 服务端渲染
- 它自身抛出来的错误（并非它的子组件）

具体代码请看 [demo](./0_react_demo) 的 `TestErrorBoundaries.jsx` 文件。

</br>

## HOC (Higher-Order Components, 高阶组件)

HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的**设计模式**。

具体而言，高阶组件是**参数为组件**，**返回值为新组件**的函数。

组件是将 `props` 转换为 UI ，而高阶组件是将组件转换为另一个组件。

</br>

## ref

### ref 基础用法

基本与 Vue 的 `ref` 类似，都是一种快速查询 DOM 的一种方式。

``` js
import React, { Component, createRef } from 'react';
class Child extends Component {
  constructor(props) {
    super(props);
    this.myDiv = createRef();
  }
  // ...
  render() {
    return <div ref={this.myDiv}>div</div>
  }
  doSomething() {
    // 通过 .current 访问对应的 DOM 元素
    console.log(this.myDiv.current)
  }
}
```

除了上面的方式，还有另外一种。具体代码请看 [demo](./0_react_demo) 的 `TestRefs.jsx` 文件。

### Refs 转发 (forwardRef)

Ref 转发就是**把函数组件中的 `ref` "转发"给父组件**。

一般来说，父组件不需要关心子组件的 refs ，也没必要获取他们。对于大多数应用中的组件来说，这通常不是必需的。

但其对某些组件，尤其是可重用的组件库是很有用的，例如函数组件、高阶组件。

具体代码请看 [demo](./0_react_demo) 的 `TestForwardingRefs.jsx` 文件。

</br>

## render-prop

render prop 是一个用于告知组件需要渲染什么内容的函数 prop 。

例如有这么一个组件，里面封装了很多**事件监听器**，我们想复用这个组件。但组件渲染的内容未必是我们需要的。那么我们就可以把 `render` 作为参数传给组件。

具体代码请看 [demo](./0_react_demo) 的 `RenderProp.jsx` 文件。

</br>

## 严格模式

用 `StrictMode` 包括的组件就会被严格模式检测。 StrictMode 不会渲染任何可见的 UI 。它为其后代元素触发额外的检查和警告。

注意，严格模式检查仅在开发模式下运行；它们不会影响生产构建。

`StrictMode` 目前有助于：

- 识别不安全的生命周期
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API

详细介绍请看[官网](https://reactjs.bootcss.com/docs/strict-mode.html)。

</br>

## 非受控组件

以处理表单数据为例。

所谓的**受控组件**，就是表单数据由 React 组件来管理，如下：

``` js
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    // 表单的数据和事件都由组件控制
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:<input type="text" ref={this.input} />
        </label>
      </form>
    );
  }
}
```

而**非受控组件**，就是把真实数据存在 DOM 节点中，只有在提交表单时才读取验证，如下：

``` js
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.current.files[0].name}`);
  }
  render() {
    // 仅控制表单提交
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file: <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

两者如何选择，下面表格可以作为参考：

|            特征            | 不受控制 | 受控 |
|:--------------------------:|:--------:|:----:|
| 一次性取值（例如，提交时） |    √     |  √   |
|         提交时验证         |    √     |  √   |
|        即时现场验证        |    x     |  √   |
|    有条件地禁用提交按钮    |    x     |  √   |
|        强制输入格式        |    x     |  √   |
|     一个数据的多个输入     |    x     |  √   |
|          动态输入          |    x     |  √   |

</br>
</br>

# 与 TypeScript 结合

TODO:


</br>
</br>

# 测试

详细请看[官方文档](https://reactjs.bootcss.com/docs/testing.html)的介绍。

下面简单说说与 Jest 的配合使用。

create-react-app 自带 Jest ，不需要安装，但需要安装 react-test-renderer 。

一般来说，测试组件的命名是 `*.test.jsx` ，一般前缀与组件名相同。

在 [demo](./0_react_demo) 中请查看 `TestJest.jsx` 和 `TestJest.test.jsx` 文件。

控制台运行 `npm run test` 执行测试。

</br>
</br>

# HOOK

Hook 是 React **16.8** 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

官方没有计划从 React 中移除 class。

Hook 和现有代码可以同时工作，你可以渐进式地使用他们。

使用 HOOK 有两个**使用规则**：

- 只能在**函数最外层**调用 Hook 。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。（还有自定义的 Hook 中）

有时候我们会想要在组件之间重用一些状态逻辑，除了高阶组件和 render props ，还可以使用 **自定义 Hook**。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。

自定义 Hook 必须以 "`use`" 开头，这个约定非常重要。

在两个组件中使用相同的 Hook 不会共享 state 。

具体代码请看 [demo](./0_react_demo) 的 `TestHook.jsx` 文件。

关于 [Hooks FAQ](https://reactjs.bootcss.com/docs/hooks-faq.html)

</br>
</br>

# 使用 react-transition-group 实现动画

通过 `npm install react-transition-group --save` 安装。

使用的方法与Vue的过渡/动画大同小异，不多介绍了。点击[官网](https://reactcommunity.org/react-transition-group/)查看详细。


</br>
</br>

# 组件拆分

拆分成 UI 和 逻辑

无状态组件(一般用作UI组件)

``` js
import React from 'react';
// 无状态组件的核心是一个无副作用的函数，接收一个 props 参数
// props 包含需要显示的数据；处理触发事件的函数
const MyComponentUi = props => {
  return <div>
    <button onClick={props.handleClick}>{props.myBtnName}</button>
  </div>
}
```

</br>
</br>

# CSS 样式

## styled-components

在JS文件里写CSS。 TODO:
