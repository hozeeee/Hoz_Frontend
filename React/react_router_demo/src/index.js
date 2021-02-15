import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    {/* 若想使用基于 react-router-dom 的路由，必须在最外层包裹 BrowserRouter */}
    {/* BrowserRouter 被称为"路由器" */}
    {/* 与 BrowserRouter  类似的还有 HashRouter ，与前者不同的是 HashRouter 使用"哈希模式"，即 URL 后面带有"#" */}
    {/* 前两个类似的还有 MemoryRouter ，区别在于 MemoryRouter 不会把 URL 显示到地址栏，只会保存到内存中 */}
    <BrowserRouter
      // 包含如下属性：
      // basename: string, 根路径
      // getUserConfirmation: function, 跳转路由前的确认函数(必须内路由组件内添加 <Prompt/> 组件)
      // forceRefresh: boolean, 跳转路由是否刷新
      // keyLength: number, location.key 的长度，默认为6
      // children: node, 子元素
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

