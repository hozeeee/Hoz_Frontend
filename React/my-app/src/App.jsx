// 组件中即使没用到 React 对象上的属性，也要引入，否则会无法解析 JSX 语法
import React, { Component, Fragment } from 'react';
import Parent from './Parent.jsx'
import store from './store'
import Test from './Test'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 'foo',
      list: ['baz1', 'baz2'],
      myHtmlText: '<h1>myHtmlText</h1>',
    }

    this.state.inputValue_ = store.getState().inputValue_
    // 订阅 store
    store.subscribe(_ => {
      this.setState(store.getState())
    })


    // 绑定组件中方法 this 的指向，否则 DOM 事件监听器的 this 会指向 undefined
    this.handleInputChange = this.handleInputChange.bind(this)

  }

  // 渲染函数
  render() {
    return (
      // 最外层必须只有一个根元素，若不想渲染出实体元素，可以使用 Fragment 组件作为占位符
      <Fragment>
        {/* 引用组件的值使用花括号{}包裹 */}
        <p>{this.state.inputValue}</p>
        <p>
          <input
            // JSX 中，元素的类名应该使用 className 代替 class ， 因为 class 会与 js 中的 class 关键字冲突
            className="my_input"
            // React 的数据流是单向的，若不改变数据源，input 的值会永远不能改变。
            // 和 Vue 不同，元素属性绑定数据时，不需要用引号包裹，直接 prop={...} 即可。
            value={this.state.inputValue}
            // 绑定事件 (注意，"on"后面的字母需要大写)
            // 监听器函数中默认的 this 指向是 undefined ，需要使用 .bind 绑定到此组件
            onChange={this.handleInputChange.bind(this)}
          />
          <button onClick={this.handleClick.bind(this)}>添加</button>
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
        {/* 若我们不想对数据转义显示，可以使用 dangerouslySetInnerHTML.__html 指定元素中的 HTML 文本 */}
        <p dangerouslySetInnerHTML={{ __html: this.state.myHtmlText }}></p>
        <p>{this.state.myHtmlText}</p>
        {/* JSX 中，元素应该使用 htmlFor 代替 for ， 同样是为了避免与 js 中的 for 关键字冲突 */}
        <label htmlFor="lable_input">label</label>
        <input id="lable_input" type="radio" />
        <hr />
        <Parent />
        <hr />
        <input type="text" onChange={this.testRedux.bind(this)} value={this.state.inputValue_} />
        <hr />
        <Test />
      </Fragment>
    )
  }
  testRedux(e) {
    const inputValue_ = e.target.value,
      action = {
        type: 'myActionType',
        data: { inputValue_ },
        foo: 'baz'
      }
    store.dispatch(action)
  }
  // 上面提到React是单向数据流，所以必须定义修改数据源的函数
  // 监听器的参数与原生的事件对象一致
  handleInputChange(e) {
    // 错误写法：不能直接对 state 里面的属性赋值
    // this.state.inputValue = e.target.value
    // 正确写法：调用组件中的 setState() 方法，传入需要修改的键值对
    this.setState({
      inputValue: e.target.value
    })
    // 新语法推荐下面写法，setState 传入一个函数，而非对象。注意，下面方法是一个异步执行的方法。
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
}


export default App;
