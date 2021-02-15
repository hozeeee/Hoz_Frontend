import React from 'react';
import { connect } from 'dva';

function Home({ dispatch, random }) {
  function asyncUpdateRandom() {
    dispatch({ type: "homeState/asyncUpdateRandom", random: Math.random() })
  }
  function updateRandom() {
    dispatch({ type: "homeState/updateRandom", random: Math.random() })
  }

  return (<div>
    <h1>Home</h1>
    <hr/>
    <p>
      <span>randow:</span>
      <span style={{ fontWeight: "bold" }}>{random}</span>
    </p>
    <hr/>
    <p>
      <button onClick={updateRandom}>立即更新 random</button>
      <span> </span>
      <button onClick={asyncUpdateRandom}>2 秒后更新 random</button>
    </p>
  </div>)
}

// connect 就是 Redux 的 connect
// 下面代码表示只针对 random 的值更新渲染模块
export default connect(({ homeState: { random } }) => ({ random }))(Home);

