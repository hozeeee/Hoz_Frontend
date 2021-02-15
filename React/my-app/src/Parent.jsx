import React, { Component } from 'react';
import Child from './Child.jsx'

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
      {
        this.state.list.map((item, index) => {
          return <Child
            key={index}
            // "父"向"子"组件传递 数据
            content={item}
            index={index}
            // "父"向"子"组件传递 方法
            handleClick={this.handleItemClick}
          />
        })
      }
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

export default Parent