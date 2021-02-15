function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeout);
  })
}

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'homeState',

  // 初始值，优先级低于传给 dva() 的 opts.initialState  （ const app=dva({initialState:{random:1}}) ）
  state: {
    random: Math.random()
  },

  // 订阅。在 app.start() 时自动被执行。
  // 一般作为监听器，如监听路由变化、各种DOM事件、订阅服务器数据(websocket)。
  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      history.listen((pathname) => {
        console.log(pathname)
      })
    },
  },

  // 用于处理异步操作和业务逻辑，不直接修改 state 。由 action 触发。
  // 触发示例： dispatch({ type: 'homeState/asyncUpdateRandom', random: 2 });
  effects: {
    // *(action, effects) => void
    * asyncUpdateRandom({
      random
    }, {
      call,
      put
    }) {
      // 此处是一个异步函数，会自动等待它执行完成
      yield delay(2000);
      // 调用同步的 action
      yield put({
        type: 'updateRandom',
        random
      });
    }
  },

  // 用于同步操作。由 action 触发。
  reducers: {
    updateRandom(state, action) {
      return {
        ...state,
        random: action.random
      }
    }
  },
}
