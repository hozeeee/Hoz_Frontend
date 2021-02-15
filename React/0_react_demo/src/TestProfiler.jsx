import React, { Component, Profiler } from 'react';


class TestProfiler extends Component {
  render() {
    // 必须传入两个 prop ：id 和 onRender
    return <Profiler id="TestProfiler" onRender={onRenderCallback}>
      <Child />
    </Profiler>
  }
}

class Child extends Component {
  render() {
    return <div>这是里面的文本</div>
  }
}



function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) {
  console.log("------ Profiler Callback ------");

  // id: string - 发生提交的 Profiler 树的 id。 如果有多个 profiler，它能用来分辨树的哪一部分发生了“提交”。
  console.log("id:", id);

  // phase: "mount" | "update" - 判断是组件树的第一次装载引起的重渲染，还是由 props、state 或是 hooks 改变引起的重渲染。
  console.log("phase:", phase);

  // actualDuration: number - 本次更新在渲染 Profiler 和它的子代上花费的时间。
  // 这个数值表明使用 memoization 之后能表现得多好。（例如 React.memo，useMemo，shouldComponentUpdate）。
  // 理想情况下，由于子代只会因特定的 prop 改变而重渲染，因此这个值应该在第一次装载之后显著下降。
  console.log("actualDuration:", actualDuration);

  // baseDuration: number - 在 Profiler 树中最近一次每一个组件 render 的持续时间。
  // 这个值估计了最差的渲染时间。（例如当它是第一次加载或者组件树没有使用 memoization）。
  console.log("baseDuration:", baseDuration);

  // startTime: number - 本次更新中 React 开始渲染的时间戳。
  console.log("startTime:", startTime);

  // commitTime: number - 本次更新中 React commit 阶段结束的时间戳。
  // 在一次 commit 中这个值在所有的 profiler 之间是共享的，可以将它们按需分组。
  console.log("commitTime:", commitTime);

  // interactions: Set - 当更新被制定时，“interactions” 的集合会被追踪。（例如当 render 或者 setState 被调用时）。
  console.log("interactions:", interactions);

  console.log("-------------------------------");
}

export default TestProfiler;