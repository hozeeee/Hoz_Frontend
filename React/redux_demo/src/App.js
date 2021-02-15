import React from 'react';
import store from './store';
import "./App.css";

function App(props) {
  const CLOLOR_DICT = {
    1: "green",
    2: "gray",
    0: "red"
  }
  const BORDER_STYL_DICT = {
    1: "solid",
    2: "double",
    3: "inset",
    4: "dashed",
    0: "groove"
  }

  // 组件中可以通过 getState 方法获取 state
  let bgState = store.getState().bgColor,
    borderState = store.getState().borderStyle

  // 改变状态
  function handleChangeState() {
    handleChangeBgColor()
    handleChangeBorderStyle()
  }
  function handleChangeBgColor() {
    let count = bgState.count + 1,
      color = CLOLOR_DICT[count % 3]
    store.dispatch({ type: "CHANGE_BG_COLOR", data: { count, color } })
  }
  function handleChangeBorderStyle() {
    let count = bgState.count,
      borderStyle = BORDER_STYL_DICT[count % 5]
    store.dispatch({ type: "CHANGE_BORDER_STYLE", data: borderStyle })
  }

  return (
    <div className="App">
      <button
        className={`bg_color_ctrler ${bgState.color} ${borderState}`}
        onClick={handleChangeState}
      >
        <span>
          <p>计数: {bgState.count}</p>
          <p>背景: {bgState.color}</p>
          <p>边框：{borderState}</p>
        </span>
      </button>
    </div>
  );
}

export default App;
