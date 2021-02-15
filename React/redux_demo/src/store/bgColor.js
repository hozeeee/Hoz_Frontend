// 定义需要存放的数据 (永不改变)
const homeBgColor = {
  count: 1,
  color: "green"
}

// reducer 可以接收 state ，但绝不能修改 state
export default (prevState = homeBgColor, action) => {
  // type 属性可以简单理解为"事件名"，通过该值的决定执行什么操作
  if (action.type === 'CHANGE_BG_COLOR') {
    // 简单深拷贝默认数据
    let newState = JSON.parse(JSON.stringify(prevState))
    // 需要更新的数据
    Object.assign(newState, action.data)
    // 返回新的 store
    return newState
  }
  return prevState
}