import React, { Component } from 'react';

// 必须引入同一个 context
import { ThemeContext } from './theme-context.js';

class ContainerBox extends Component {
  render() {
    return <fieldset>
      <legend>ContainerBox</legend>
      <InsideBox />
      <hr />
      <InsideBox2 />
    </fieldset>
  }
}

class InsideBox extends Component {
  // 指定 contextType 读取当前的 context 。若忽略这一步， context 的值是空对象。
  // React 会往上找到最近的 Provider，然后使用它的值。
  static contextType = ThemeContext

  render() {
    let { theme } = this.context
    return <div style={{ display: "flex" }}>
      InsideBox1：
      {/* <button onClick={this.test.bind(this)}> test</button> */}
      <div style={{
        width: "20px",
        height: "20px",
        border: `2px solid ${theme.borderColor}`,
        color: theme.color,
        backgroundColor: theme.backgroundColor
      }}>1</div>
    </div>
  }
}


function InsideBox2() {
  // Context.Consumer 内提供一个渲染函数
  return <ThemeContext.Consumer>
    {({ theme, toggleTheme }) => (
      <div style={{ display: "flex" }}>
      InsideBox2：
        <div style={{
        width: "20px",
        height: "20px",
        border: `2px solid ${theme.borderColor}`,
        color: theme.color,
        backgroundColor: theme.backgroundColor
      }}>2</div>
      {/* 子组件更改 context 的值，思路和"父子组件"通信类似，把修改状态的方法放到 context 即可 */}
      <button style={{ marginLeft: "20px" }} onClick={toggleTheme}>子组件更改context</button>
    </div>
    )}
  </ThemeContext.Consumer>
}

export default ContainerBox;