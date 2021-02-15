import React from 'react';
// 这个包需要单独安装， create-react-app 没有包含
import renderer from 'react-test-renderer';

// 引入被测试的组件
import MyLink from './TestJest';


// 第一个参数是"测试名称"；第二个参数是"测试函数"
test('Link changes the class when hovered', () => {
  const component = renderer.create(
    // 跟普通的 JSX 写法一样
    <MyLink page="http://www.facebook.com">Facebook</MyLink>,
  );

  // 生成 DOM 快照
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // 手动触发回调
  tree.props.onMouseEnter();
  // 然后重新渲染
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // 同上....
  tree.props.onMouseLeave();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
