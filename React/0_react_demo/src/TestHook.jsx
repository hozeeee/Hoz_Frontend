import React, { useState, useEffect, useContext, useRef, useImperativeHandle } from 'react';


const MyContext = React.createContext();


class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTestHook: true
    }
    this.myInput = React.createRef();
  }
  render() {
    return <div>
      <fieldset>
        <legend><button onClick={() => { this.setState({ showTestHook: !this.state.showTestHook }) }}>模块显示开关</button></legend>
        <p>----- 包含 useState 和 useEffect -----</p>
        {this.state.showTestHook && <TestHook />}
      </fieldset>

      <fieldset>
        <legend>测试 useContext</legend>
        <MyContext.Provider value={{ foo: "baz" }}>
          <TestHookUseContext />
        </MyContext.Provider>
      </fieldset>

      <fieldset>
        <legend>测试 useRef</legend>
        <TestHookUseRef />
      </fieldset>

      <fieldset>
        <legend>测试 useImperativeHandle</legend>
        <button onClick={() => { this.myInput.current.focus() }}>focus</button>
        <TestHookUseImperativeHandle ref={this.myInput} />
      </fieldset>

      <fieldset>
        <legend>其他不介绍了</legend>
        <p>useReducer</p>
        <p>useMemo</p>
        <p>useDebugValue</p>
      </fieldset>
    </div>
  }
}


// 组件使用函数的方式书写
function TestHook() {
  // count 和 setCount 分别是"状态变量"和"修改状态的方法"。
  // useState 传入的参数是 count 的初始值。
  // 在函数组件里调用 useState 来给组件添加一些内部 state 。
  const [count, setCount] = useState(1);


  // useEffect 就是一个 Effect Hook ，给函数组件增加了操作副作用的能力。
  // useEffect 是异步执行的，不会阻塞浏览器更新屏幕。如果需要同步操作，请使用 useLayoutEffect ，用法相同。
  // 所谓的"副作用"，或者说是"作用"，就是在组件中执行过数据获取、订阅或者手动修改过 DOM 。
  useEffect(() => {
    // 函数内执行的就是生成"副作用"的部分。
    // 相当于 componentDidMount 和 componentDidUpdate 。
    document.title = 'test effect hook';
    // 函数的返回值是一个函数，用于清除"副作用"。
    // 相当于 componentWillUnmount 。
    return () => { document.title = 'default title' };
  });


  // 使用自定义 HOOK
  let clock = useClock();


  // 函数返回渲染的内容
  return <div>
    <button onClick={() => setCount(count + 1)}>点我</button>
    <span>点击计数：{count}</span>
    <p>{clock}</p>
  </div>
}


// 定义自定义 HOOK （说的很玄乎，其实就是把部分逻辑抽离到一个函数中）
// 下面做个简单的定时器来显示时间
function useClock(defaultTime = new Date()) {
  const [clock, setClock] = useState(new Date().toISOString());
  useEffect(() => {
    let timer = null;
    timer = setTimeout(() => {
      setClock(new Date().toISOString());
    }, 100);
    return () => { clearInterval(timer); };
  });
  return clock;
}


// 测试 useContext
function TestHookUseContext() {
  const value = useContext(MyContext);
  return <div>{value.foo}</div>
}


// 测试 useRef
function TestHookUseRef() {
  // 看这里。其实就是 class 的 createRef 的替代品。
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}


// 测试 useImperativeHandle
// 必须配合 forwardRef(Refs转发) 使用。 
// useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。
// 说人话就是，对暴露给父组件的 ref 做了封装，下面例子中就是"改写"了 focus 方法。
const TestHookUseImperativeHandle = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(
    // 第一个参数： 源 ref
    ref,
    // 第二个参数： 一个返回新对象的函数，新对象中包含 ref.current 需要被修改的变量
    () => ({
      // 同名则覆盖，不同名则添加
      focus: () => {
        console.log("---- ref.current.focus ----"); // 额外的操作...
        inputRef.current.focus();
      }
    }));
  return <input ref={inputRef} {...props} />;
})


export default Container;

