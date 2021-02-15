import React from 'react';
import { Menu } from 'antd';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
// 页面组件
import Home from './routes/Home';
// import TodoList from './routes/TodoList';


function RouterConfig({ history, app }) {

  // 动态加载某个模块和组件
  const TodoList = dynamic({
    app,
    models: () => [import('./models/todoListState'),],
    component: () => import('./routes/TodoList')
  })

  function handleClick({ key }) {
    history.push(key)
  }

  return (
    <div className="router_config" style={{ display: "flex", height: "100%" }}>
      <Menu
        onClick={handleClick}
        style={{ width: 256 }}
        mode="inline"
        defaultSelectedKeys={history.location.pathname}
      >
        <Menu.Item key="/home">Home</Menu.Item>
        <Menu.Item key="/todoList">TodoList</Menu.Item>
      </Menu>
      <Router history={history}>
        <Switch>
          <Route path="/" exact redirect="/home" />
          <Route path="/home" exact component={Home} />
          <Route path="/todoList" exact component={TodoList} />
        </Switch>
      </Router>
    </div>
  );
}

export default RouterConfig;
