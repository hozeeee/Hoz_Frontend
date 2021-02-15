import React, { Component, createRef } from 'react';

class TestRefs extends Component {
  constructor(props) {
    super(props);
    this.myRef = createRef();
    this.myRef2 = createRef();
    this.myRef3 = null;
    this.myRef4 = createRef();
  }

  render() {
    return <div>
      {/* 作用于普通的 DOM 元素 */}
      <p ref={this.myRef}>--- 这是一行文字</p>

      {/* 作用于 class */}
      <Child ref={this.myRef2} />

      {/* 除了 createRef ，还可以使用 "回调 refs" 的方式 */}
      <p ref={el => { this.myRef3 = el }}>--- 这是一行文字2</p>

      {/* 对于函数组件，不能使用 ref （请使用 refs 转发） */}
      <MyFunctionComponent ref={this.myRef4} />

      <p><button onClick={this.handleClick}>打印 ref</button></p>
    </div>
  }

  handleClick = () => {
    // 通过 ref.current 访问到指定元素
    console.log("作用于普通 DOM 元素的 ref ：", this.myRef.current);
    console.log("作用于 class 组件的 ref (组件对象,非DOM对象)：", this.myRef2.current);
    console.log("作用于普通 DOM 元素的 ref (回调函数)：", this.myRef3);
    console.log("作用于 function 组件的 ref (ref转发)：", this.myRef4);
  }
}


class Child extends Component {
  render() {
    return <div>--- class 组件</div>
  }
}


const MyFunctionComponent = React.forwardRef((props, ref) => {
  const myRef = React.useRef();
  function handleCilck(e) {
    console.log("HOOK 中的 ref (useRef)：", myRef.current);
  }
  return <p ref={ref}>
    <span ref={myRef}>--- function 组件</span>
    <button onClick={handleCilck}>useRef</button>
  </p>;
})


export default TestRefs;
