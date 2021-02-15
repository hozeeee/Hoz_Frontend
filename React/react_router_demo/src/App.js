import React, { } from 'react';
import './App.scss';

// React Router 中有三类组件:
//  router 组件 (BrowserRouter, HashRouter, ...)
//  route matching 组件 (Route, Switch, ...)
//  navigation 组件 (Link, ...)
import {
  // 组件
  Switch, Route, Redirect, Link, NavLink,
  // hooks 函数 (react 16.8 以上)
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from "react-router-dom";

import Home from "./pages/Home"
import { Page1, Page2 } from "./pages/Pages"
import NotFound404 from "./pages/NotFound404"

function App() {
  // 用于操作路由，如跳转、替换等操作
  let history = useHistory();
  // 用于获取当前 URL 的 location 对象
  let location = useLocation();
  // 获取路径参数的键/值对的对象 (需要在 Route 的 path 属性预先配置好)
  let routeParams = useParams();
  // 以特定规则获取路径参数 (示例中就是把"home"后面的路径作为"username"参数获取) (无需在意 Route 的 path 属性配置)
  let match = useRouteMatch("/home/:username");

  console.log(history, location, routeParams, match)

  function gotoPage1() {
    history.push('/page1/18')
  }

  return (
    <div className="app_container">
      <div className="left_menu_container">
        {/* 声明式导航(标签) */}
        <p><Link to="/home/zhangsan">Home</Link></p>
        <p><Link to="/redirectToPage2">redirectToPage2</Link></p>
        {/* NavLink 可以指定 activeClassName 属性，用于激活时添加的类名 */}
        <p><NavLink to="/page2" activeClassName="my_active_navlink">page2</NavLink></p>
        {/* 编程式导航 */}
        <button onClick={gotoPage1}>Page1</button>
        <p><Link to="/???">???</Link></p>
      </div>
      <div className="right_page_container">
        {/* Switch 被称为路由匹配器 */}
        {/* 当渲染 Switch 组件时，它将搜索它的 Route 子元素，只渲染第一个匹配的 Route */}
        <Switch>
          {/* 在 component 属性中指定 路由组件 */}
          <Route path="/home" component={Home} />
          {/* exact 属性表示完全匹配，而不是路径开头满足就属于匹配 */}
          <Route exact path="/page2"><Page2 /></Route>
          {/* 也可以在 Route 标签内放入 路由组件 */}
          <Route path="/page1/:age"><Page1 /></Route>
          {/* 重定向 */}
          <Route path="/redirectToPage2">
            <Redirect to="page2" />
          </Route>
          {/* 当 Route 没有指定 path 属性时，表示总是渲染，可用于显示 404 页面 */}
          <Route component={NotFound404} />
        </Switch>
      </div>
    </div>
  );
}


export default App;
