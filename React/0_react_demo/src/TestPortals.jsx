import React, { Component } from 'react';
import { createPortal } from 'react-dom';

const targetEl = document.getElementById('modal_root');


class TestPortals extends Component {
  render() {
    let targetEl;
    return <div>
      <Parent targetEl={targetEl}>
        <Child />
      </Parent>
    </div>
  }
}


class Parent extends Component {
  constructor(props) {
    super(props);
    this.openDialog = this.openDialog.bind(this);
    // 在 "root"div 外部还创建了一个"modal_root"div ，用于存放新的组件 （请查看 index.html 文件）
    this.targetEl = targetEl;
    // 创建一个 div 元素，方便 添加和移除 操作
    this.containerEl = document.createElement('span');
  }

  // 组件生命周期中，添加和移除
  componentDidMount() {
    this.targetEl.appendChild(this.containerEl);
  }
  componentWillUnmount() {
    this.targetEl.removeChild(this.containerEl);
  }

  render() {
    return <div
      // 由于 portal 仍存在于 React 树，且与 DOM 树 中的位置无关，子组件的事件冒泡仍会在这里被触发
      onClick={() => { console.log("子组件的事件冒泡...") }}
      // 由于 Portals 渲染的元素并非在此组件下，所以不会受 "overflow:'hidden'" 的影响
      style={{ overflow: "hidden" }}
    >
      <p>
        <span>这是父元素的内容:</span>
        <button onClick={this.openDialog}>打开弹框</button>
      </p>
      {createPortal(
        // 被挂载到容器的组件
        this.props.children,
        // 作为容器的 DOM 元素
        this.containerEl,
      )}
    </div>
  }

  openDialog() {
    this.targetEl.style.display = "flex";
  }
}


class Child extends Component {
  render() {
    // 注意观察控制台打印，点击子组件的任意位置，都会触发事件冒泡 
    return <div style={{ height: "300px", width: "500px", border: "2px solid #aaa", backgroundColor: "#fff" }}>
      <button onClick={this.closeDialog} >关闭对话框</button>
    </div>
  }

  closeDialog() {
    targetEl.style.display = "none";
  }
}

export default TestPortals;
