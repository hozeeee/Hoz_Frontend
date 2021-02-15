import React, { Component } from 'react';


// 用于渲染的组件
class Cat extends Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <div style={{ position: 'absolute', left: mouse.x, top: mouse.y, backgroundColor: '#aaa' }}>cat</div>
    );
  }
}

// 可以被重用的组件（需要传入渲染组件）
class Mouse extends Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }
  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }
  render() {
    return (
      <div style={{ height: '300px', backgroundColor: 'green' }} onMouseMove={this.handleMouseMove}>
        {/* 把此组件的状态传给渲染组件 */}
        {this.props.renderFn(this.state)}
      </div>
    );
  }
}

// 组合后的组件
class MouseTracker extends Component {
  render() {
    return (
      <div>
        <h3>在下面区域移动鼠标!</h3>
        <Mouse renderFn={
          mouse => (<Cat mouse={mouse} />)
        } />
      </div>
    );
  }
}

export default MouseTracker;