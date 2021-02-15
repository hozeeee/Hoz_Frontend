import React, { Component } from 'react';

class Child extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  render() {
    return <div style={{userSelect:"none",cursor:"pointer"}}
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



export default Child