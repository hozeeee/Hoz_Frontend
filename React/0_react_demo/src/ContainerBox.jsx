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

export default ContainerBox;