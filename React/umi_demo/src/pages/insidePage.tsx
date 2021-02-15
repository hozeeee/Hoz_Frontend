import React from 'react';
import './insidePage.less';

export default (props) => {
  return <div className={props.route.path.includes('son1') ? 'bg_red' : 'bg_green'}>
    <p>子路由的内容</p>
    <p>{console.log(props)}</p>
    <p>{props.route.name}</p>
  </div>
}
