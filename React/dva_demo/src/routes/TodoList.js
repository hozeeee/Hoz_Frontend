import React from 'react';
import { connect } from 'dva';

function TodoList({ dispatch, listData }) {
  function handleItemClick(item) {
    dispatch({ type: "todoListState/delItem", item })
  }

  let items = listData.map(
    (item, index) => (<p
      key={index}
      style={{ cursor: "pointer", textIndent: "20px" }}
      onClick={handleItemClick.bind(undefined, item)}
    >{item}</p>)
  )
  return (<div style={{ width: "100%" }}>
    <h1>点击删除行：</h1>
    <hr/>
    {items}
  </div>)
}


export default connect(({ todoListState: { listData } }) => ({ listData }))(TodoList)
