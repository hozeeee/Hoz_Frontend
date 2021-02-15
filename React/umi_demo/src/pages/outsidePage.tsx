import React from 'react';
import './outsidePage.less';

export default (props) => {
  return <div className="outside_container">
    <div className="left">
      父路由固定的内容
    </div>
    <div className="right">
      {props.children}
    </div>
  </div>
}
