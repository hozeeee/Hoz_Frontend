// React 组件是解析编译 JSX 语法的前提
import React from 'react';
// ReactDOM 的作用是把内容渲染到页面上
import ReactDOM from 'react-dom';

// 引入组件 (注意，组件必须以大写字母开头)
import App from './App.jsx';

// 引入 css 文件 （组件同样可以单独引入属于自己的 css 文件）
import './index.css';

// ReactDOM 的渲染函数
ReactDOM.render(
  // 根组件
  <App />,
  // 挂载的目标元素
  document.getElementById('root')
);
