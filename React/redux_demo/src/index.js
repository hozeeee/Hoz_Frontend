import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';

const render = () => ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
render();


// 注册监听器 (否则状态更新也不会重新渲染)
// 实际开发中不要在此处监听，否则会导致整个页面重新渲染，导致性能问题
// 在组件中，把数据放在 state 中，利用组件的 setState 触发重新渲染
store.subscribe(render);
