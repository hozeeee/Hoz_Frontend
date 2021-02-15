import React, { Component, Fragment } from 'react';
import Parent from './Parent.jsx'
import store from './store'

class TestUI extends Component {
  render() {
    return <button onClick={this.handleClick}>test</button>
  }
}

export default TestUI