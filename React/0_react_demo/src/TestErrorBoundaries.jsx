import React, { Component } from 'react';


class TestErrorBoundaries extends Component {
  render() {
    return <ErrorBoundaries>
      <ThisChild />
    </ErrorBoundaries>
  }
}


// "错误边界"可以套在任何组件外面
class ErrorBoundaries extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。
  static getDerivedStateFromError(error) {
    // 使用 static getDerivedStateFromError() 渲染备用 UI
    // 更新 state 使下一次渲染能够显示降级后的 UI
    console.log("------ getDerivedStateFromError ------");
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 使用 componentDidCatch() 打印错误信息
    // 你同样可以将错误日志上报给服务器
    // (发送请求...)
    console.log("------ componentDidCatch ------");
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}


class ThisChild extends Component {
  // 想看效果请解除下面注释：
  // componentDidMount() {
  //   throw new Error("????");
  // }

  render() {
    return <div>
      <span>点击就报错：</span>
      <button onClick={this.testThrowErr}>点我</button>
    </div>
  }

  testThrowErr() {
    // 这种错误无法在"错误边界"被拦截
    throw new Error("????");
  }
}


export default TestErrorBoundaries;
