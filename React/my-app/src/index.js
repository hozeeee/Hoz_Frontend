// React 组件是解析编译 JSX 语法的前提
import React from 'react';
// ReactDOM 的作用是把内容渲染到页面上
import ReactDOM from 'react-dom';

// 引入组件 (注意，组件必须以大写字母开头)
import App from './App.jsx';

// ReactDOM 的渲染函数
ReactDOM.render(<App />, document.getElementById('root'));


