import React, { Component, forwardRef, createRef } from 'react';

class TestForwardingRefs extends Component {
  constructor(props) {
    super(props);
    // 在转发 Refs 前，必须先创建
    this.myRef = createRef();
    this.myRef2 = createRef();
  }
  render() {
    return <div>
      {/* 在 ref 属性中指定 Ref 实例 */}
      <ChildComp ref={this.myRef}>子组件的"props.children"</ChildComp>
      <MyComp ref={this.myRef2} />
      <button onClick={this.handleClick}>print-ref</button>
    </div>
  }

  handleClick = () => {
    console.log(this.myRef.current);
    console.log(this.myRef2.current);
  }
}


// ----------- 对于函数组件 -----------
// 默认情况下，你不能在函数组件上使用 ref 属性，因为它们没有实例。
// 但可以使用 forwardRef ，将 ref.current 指向内部的 DOM 节点。
const ChildComp = forwardRef(
  // 以第二个参数的形式传入
  (props, ref) => (
    <div>
      <p>子组件的默认部分。</p>
      <p ref={ref} className="FancyButton">
        {props.children}
      </p>
    </div>
  )
);
// -----------------------------------


// ----------- 对于高阶组件 -----------
// 函数组件
const _MyComp = forwardRef(
  // ref 的路径：3
  (props, ref) => (
    <div>
      <p ref={ref}>测试高阶组件</p>
    </div>
  )
);
// 高阶组件
function logProps(WrappedComponent) {
  class LogProps extends Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }
    // 渲染目标组件，并把所有 props 传到目标组件上
    render() {
      const { forwardedRef, ...rest } = this.props;
      // 将自定义的 prop 属性 "forwardedRef" 定义为 ref
      // ref 的路径：2
      return <WrappedComponent ref={forwardedRef} {...rest} />;
    }
  }
  // return LogProps;
  // 在原来的基础上再套多一层 forwardRef
  return forwardRef((props, ref) => {
    // ref 的路径：1
    return <LogProps {...props} forwardedRef={ref} />;
  });
}

const MyComp = logProps(_MyComp);
// -----------------------------------


export default TestForwardingRefs;
