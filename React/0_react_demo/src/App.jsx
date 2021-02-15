// 组件中即使没用到 React 对象上的属性，也要引入，否则会无法解析 JSX 语法
import React, { Component, Fragment, Suspense } from 'react';
import Parent from './Parent.jsx';
import ContainerBox from './ContainerBox.jsx';
import TestContext from './TestContext.jsx';
import TestErrorBoundaries from './TestErrorBoundaries.jsx';
import TestPortals from './TestPortals.jsx';
import TestProfiler from './TestProfiler.jsx';
import TestRefs from './TestRefs.jsx';
import TestForwardingRefs from './TestForwardingRefs.jsx';
import RenderProp from './RenderProp.jsx';
import TestHook from './TestHook.jsx';
import MyLink from './TestJest.jsx';

// 使用 context 传递属性 （已经在该文件中创建）
import { ThemeContext, themes } from './theme-context.js';

// 使用 懒加载 方式加载组件
const LazyComp = React.lazy(() => import('./LazyComp.jsx'));


class App extends Component {

  // 构造函数
  constructor(props) {
    super(props);

    // 组件自身的状态
    this.state = {
      inputValue: 'foo',
      list: ['baz1', 'baz2'],
      myHtmlText: '<h5>myHtmlText</h5>',
      showLeft: true,
      showLazyComp: false,
      theme: themes.light
    }

    // 绑定组件中方法 this 的指向，否则 DOM 事件监听器的 this 会指向 undefined
    this.handleClick = this.handleClick.bind(this);
  }

  // 渲染函数
  render() {
    let box;
    if (this.state.showLeft) {
      box = (<div style={{ width: "50px", height: "50px", backgroundColor: "green", color: "white" }}>left</div>)
    } else {
      box = (<div style={{ width: "50px", height: "50px", backgroundColor: "blue", color: "white" }}>right</div>)
    }

    return (
      // 最外层必须只有一个根元素，若不想渲染出实体元素，可以使用 Fragment 组件作为占位符
      // 除了使用 Fragment 标签，使用 "<>"和"</>" 也是同样的效果
      <Fragment>
        <h1>列表渲染：</h1>
        {/* 引用组件的值使用花括号 {} 包裹 */}
        <p>{this.state.inputValue}</p>
        <p>
          <input
            // JSX 中，元素的类名应该使用 className 代替 class ， 因为 class 会与 js 中的 class 关键字冲突
            className="my_input"
            // React 的数据流是单向的，若不改变数据源， input 的值会永远不能改变。
            // 和 Vue 不同，元素属性绑定数据时，不需要用引号包裹，直接 prop={...} 即可，如下。
            value={this.state.inputValue}
            // 绑定事件，事件的命名采用小驼峰式 (如，"on"后面的字母需要大写)
            // 监听器函数中默认的 this 指向是 undefined ，需要使用 .bind 绑定到此组件
            onChange={this.handleInputChange.bind(this)}
            // 内敛样式的写法，注意将原来的 "-" 写法换成 "驼峰式" 写法。
            style={{ marginRight: "20px", borderColor: "red" }}
          />
          {/* 若外部已经绑定了 this 的指向，这里就可以省略 */}
          <button onClick={this.handleClick}>添加</button>
        </p>
        <ul>
          {
            // 这里直接使用 map 返回 JSX
            this.state.list.map((item, index) => {
              return (
                // 和 Vue 一样，渲染列表时，需要指定一个唯一的 key
                <li key={index}>{item}</li>
              )
            })
          }
        </ul>
        <hr />

        <h1>条件渲染：</h1>
        <p><button onClick={this.changeShowBox}>测试</button></p>
        {/* 写法一： 使用 "if" */}
        {box}
        {/* 写法二： 使用 三目运算符 */}
        {this.state.showLeft ?
          (<div style={{ width: "50px", height: "50px", backgroundColor: "yellow" }}>left</div>) :
          (<div style={{ width: "50px", height: "50px", backgroundColor: "red", color: "white" }}>right</div>)
        }
        {/* 写法三： 使用 "&&" （针对单个组件是否渲染） */}
        {this.state.showLeft && (<div style={{ width: "50px", height: "50px", backgroundColor: "black", color: "white" }}>single</div>)}
        <hr />

        <h1>"dangerouslySetInnerHTML" 属性：</h1>
        {/* 若我们不想对数据转义显示，可以使用 dangerouslySetInnerHTML.__html 指定元素中的 HTML 文本 */}
        <p dangerouslySetInnerHTML={{ __html: this.state.myHtmlText }}></p>
        <p>{this.state.myHtmlText}</p>
        <hr />

        <h1>"htmlFor" 属性：</h1>
        {/* JSX 中，元素应该使用 htmlFor 代替 for ， 同样是为了避免与 js 中的 for 关键字冲突 */}
        <label htmlFor="lable_input">label 的 for</label>
        <p>
          input<input id="lable_input" type="radio" />
        </p>
        <hr />

        <h1>HOOK：</h1>
        <TestHook />
        <hr />

        <h1>父子间组件通信：</h1>
        {/* 原理是，父组件把 数据 和 修改数据的方法 都传给子组件，子组件 读取 和 调用方法 */}
        <Parent />
        <hr />

        <h1>组件的组合/包含：（类似 Vue 的"插槽"，但 React 没有 slot 的概念）</h1>
        <ContainerBox
          leftContent={<span>通过 "props.*" 方式插入</span>}
          rightContent={<span>与左边相同</span>}
        >
          <span>这部分内容默认会传到父组件的 "props.children" 属性中</span>
        </ContainerBox>
        <hr />

        <h1>懒加载组件：</h1>
        <button onClick={() => { this.setState({ showLazyComp: !this.state.showLazyComp }) }}>test</button>
        {/* 懒加载组件必须用 Suspense 包裹，且必须提供 fallback 属性，作为优雅降级的显示 */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* Suspense 内可以有多个懒加载的组件 */}
          {/* LazyComp 组件是通过 React.lazy(() => import('./LazyComp.jsx')) 引入，看上文 */}
          {this.state.showLazyComp && <LazyComp />}
        </Suspense>
        <hr />

        <h1>使用 context ：</h1>
        <button onClick={this.toggleTheme}>toggleTheme</button>
        {/* 使用一个 Provider 来将当前的 theme 传递给以下的组件树。无论多深，任何组件都能读取这个值。例子中，我们将"dark"作为当前的值传递下去。 */}
        {/* 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。 */}
        {/* Provider 也能嵌套，子组件会读取离他最近的 context 的值 */}
        <ThemeContext.Provider value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}>
          <TestContext />
        </ThemeContext.Provider>
        <hr />

        <h1>错误边界处理：（解除注释看效果）</h1>
        <TestErrorBoundaries />
        <hr />

        <h1>使用 Portals ：</h1>
        <TestPortals />
        <hr />

        <h1>使用 Profiler ：</h1>
        <TestProfiler />
        <hr />

        <h1>使用 Refs ：</h1>
        <TestRefs />
        <hr />

        <h1>使用 ForwardingRefs （ Refs 转发）：</h1>
        <TestForwardingRefs />
        <hr />

        <h1>render prop：</h1>
        <RenderProp />
        <hr />

        <h1>使用 Jest 单元测试：</h1>
        <MyLink page="https://reactjs.bootcss.com/docs/testing.html">
          https://reactjs.bootcss.com/docs/testing.html
        </MyLink>
        <hr />

      </Fragment>
    )
  }

  // 上面提到 React 是单向数据流，所以必须定义修改数据源的函数
  // 监听器的参数与原生的事件对象一致
  handleInputChange(e) {
    // 注意， State 的更新可能是异步的。
    // 错误写法：不能直接对 state 里面的属性赋值，即 this.state.inputValue = e.target.value
    // 正确写法：调用组件中的 setState() 方法，传入需要修改的键值对，如下：
    this.setState({
      inputValue: e.target.value
    })
    // 新语法推荐下面写法， setState 传入一个函数，而非对象。注意，下面方法是一个异步执行的方法。
    /**
    const inputValue = e.target.value
    // prevState 指的是原来的 state 对象
    this.setState(prevState => {
      return { inputValue }
    })
    */
  }

  handleClick(e) {
    this.setState({
      list: [...this.state.list, this.state.inputValue]
    })
  }

  changeShowBox = () => {
    this.setState({
      showLeft: !this.state.showLeft
    })
  }

  toggleTheme = () => {
    this.setState({
      theme: this.state.theme === themes.light ? themes.dark : themes.light
    })
  }

}


export default App;
