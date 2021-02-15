import React, { Component } from 'react';

class LazyComp extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (<div>组件只有这段文字哦...</div>)
  }
}

export default LazyComp;
