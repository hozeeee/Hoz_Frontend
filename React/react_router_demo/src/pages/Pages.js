import React from 'react'
import { Prompt } from "react-router-dom";


function Page1() {
  let pList = []
  for (let i = 0; i < 60; i++) {
    pList.push(<p key={`page1_item_${i}`}>1111</p>)
  }
  return (
    <div>
      <h1>Page1</h1>
      <hr />
      {pList}
    </div>
  )
}

function Page2() {
  let pList = []
  for (let i = 0; i < 60; i++) {
    pList.push(<p key={`page2_item_${i}`}>2222</p>)
  }
  return (
    <div>
      <Prompt message="是否确定离开" />
      <h1>Page2</h1>
      <hr />
      {pList}
    </div>
  )
}

export { Page1, Page2 };
