
# Redux

## 起步

### 文档

- [中文](https://www.redux.org.cn/)
- [英文](https://redux.js.org/)

### 安装

``` shell
# 安装稳定版
npm install --save redux
# 和 React 的绑定库
npm install --save react-redux
# 对应的开发者工具
npm install --save-dev redux-devtools
```

Redux 的 chrome 插件： `Redux DevTools` 。

### 官方示例

[https://github.com/reduxjs/redux/tree/master/examples](https://github.com/reduxjs/redux/tree/master/examples)

### 简介

与 Vue 的 Vuex 类似，都是**状态容器**。可以对数据的集中管理，可用于组件间的通信。

Redux 的设计原则：

1. store 是唯一的
2. 只有通过 action 才能改变 state
3. Reducer 必须是纯函数 (纯函数:参数不变,结果一定相同,没有副作用)

### 流程图

``` txt
      store.dispatch(action)
      ┌→→→→→→→→→→→→→→→→→→→→┐   ┌→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→┐
   [Action Creators]      [Store]  (prevState,action)=>{return newState}  [Reducers]
               ↑           ↓   └←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←┘
 创建action对象 ↑           ↓
               ↑           ↓ 读取： store.getState()
               ↑           ↓ 订阅： store.subscribe(callback)
               [React Components]
```

</br>

## 简单示例

1. 安装： `npm install redux --save` 。

2. 在 `src` 目录下创建 `store` 目录，用于存放 Redux 相关的代码。 `store` 内的目录结构如下：

    ``` txt
    store
    ├── index.js    // 创建并抛出 store
    ├── reducer.js    // 创建并抛出 store
    ```

3. 创建 `reducer` (`/srcstore/reducer.js`)

    ``` js
    // 定义需要存放的数据 (永不改变)
    const defaultState = {
      foo: 'baz'
    }
    // reducer 可以接收 state ，但绝不能修改 state
    export default (prevState = defaultState, action) => {
      // type 属性可以简单理解为"事件名"，通过该值的决定执行什么操作
      if (action.type === 'myActionType') {
        // 简单深拷贝默认数据
        let newState = JSON.parse(JSON.stringify(prevState))
        Object.assign(newState, action.data)
        // 返回给 store 的数据
        return newState
      }
      return prevState
    }
    ```

4. 创建 `store` (`/srcstore/index.js`)

    ``` js
    import { createStore } from 'redux';
    import reducer from './reducer.js';
    const store = createStore(
      // 使用 createStore 方法传入之前定义好的 reducer 即可
      reducer
    );
    export default store;
    ```

5. 组件中引入并使用 `store` 的数据

``` js
// 引入 store
import store from './store/index.js';
class App extends Component {
  constructor (props){
    super(props);
    this.state = {
      otherDatas: '',
      // 使用 getState 方法获取 store 的数据
      ...store.getState()
    }
    // 使用 subscribe 方法订阅 store 的新数据
    store.subscribe(_ => {
      this.setState(store.getState())
    })
  }
  render() {
    return <input
      type="text"
      // 使用 stroe 的数据
      value={foo}
      // 修改 store 的数据
      onChange={this.handleInputChange.bing(this)}
    />
  }
  handleInputChange(e) {
    const inputValue = e.target.value,
    // 定义 action 对象 (其实 action 的数据结构并没有规定)
    action = {
      // 与 reducer 的相对应
      type: "myActionType",
      data: {foo: inputValue}
    }
    // 发送 action 给 store
    // dispatch 之后， store 并处理数据，只是把 prevState 和 action 交给 reducer 处理
    store.dispatch(action)
  }
}
```

</br>

## 扩展

### redux-thunk 库

redux-thunk 是 redux 的中间件，是 Action 和 Store 的中间件。中间件的"位置"参考下图：

``` txt
  ┌——————————————————┐
  |     Dispatch     |
┌—|  ┌————————————┐  |———┐
| |  | Middleware |  |   |
| |  └————————————┘  |   |
| └——————————————————┘   |
|          ↓             |
|          ↓       Stroe |
|          ↓             |
| ┌——————————————————┐   |
| |     Reducer      |   |
| └——————————————————┘   |
|          ↓             |
|          ↓             |
| ┌——————————————————┐   |
└—|      State       |———┘
  └——————————————————┘
```

作用： 之前我们执行 `store.dispatch(action)` ， `action` 必须是一个对象。但有了 `redux-thunk` ， `action` 可以是一个函数，我们可以在函数内发起数据请求。好处是把数据请求抽离于组件的逻辑。

安装： `npm i redux-thunk -S` 。

使用方法如大概如下：

``` js (store/index.js)
// 引入 applyMiddleware 方法
import { createStore, applyMiddleware } from 'redux'
// 引入 redux-thunk 中间件
import thunk from 'redux-thunk'
// 创建 store 时指定 redux-thunk 作为中间件
const store = createStore(
  // (reducers...),
  applyMiddleware(thunk)
)
```

``` js (Component)
class App extends Component {
  getListData() {
    // 可以传入一个执行函数 (参数是原dispatch方法)
    store.dispatch(_dispatch => {
      // 可以在里面发起数据请求
      axios.get('./json').then(res => {
        const data = res.data
        // 发送和之前一样的 dispatch
        _dispatch({
          type: 'myActionType',
          data
        })
      })
    })
  }
}
```

### redux-saga 库

同样是 redux 的中间件，提供了大量 API ，适合做大型项目。

安装： `npm i redux-saga -S` 。

使用：

``` js (store/sagas.js)
import axios from 'axios';
import {
  // 此函数作用是捕获 action.type 的值，针对性执行特定函数
  takeEvery,
  // 因为此组件没有 state.dispatch ，取而代之是 put 方法
  put
} from 'redux-saga/effects';
// 针对某个 action.type 处理的函数
function* getListData() {
  // 使用 try...catch 的原因是网络请求可能会出错
  try {
    const res = yield axios.get('./json)
    const action = {
      type: 'myActionType',
      data: res.data
    }
    // 等同于之前的 store.dispatch()
    yield put(action)
  } catch(e) {
    // ...
  }
}
// 抛出的必须是一个 generator 函数
function* mySaga() {
  // 多个 yield takeEvery 可以针对不同的 action.type ，指定响应的处理函数
  yield takeEvery('myActionType', getListData)
}
export default mySaga;
```

``` js (store/index.js)
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas'
// 创建 saga 中间件
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  // (reducers...),
  applyMiddleware(sagaMiddleware)
)
// 使用特定的 saga 文件
sagaMiddleware.use(mySaga)
```

### react-redux

react-redux 并不是 Redux 内置，需要单独安装。因为一般会和 Redux 一起使用。需要单独安装：

``` shell
npm install --save react-redux
```

react-redux 用于连接 React 组件与 Redux store ，连接操作不会改变原来的组件类，反而返回一个新的已与 Redux store 连接的组件类。

该库提供的 API 不多，这里主要介绍 `connect` 。

`connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`:

- `mapStateToProps(state, [ownProps]): stateProps`
  - 类型： Function
  - 如果定义该参数，组件将会监听 Redux store 的变化。
  - 任何时候，只要 Redux store 发生改变， `mapStateToProps` 函数就会被调用。
  - 该回调函数必须返回一个纯对象，这个对象会与组件的 `props` 合并。
  - 如果你省略了这个参数，你的组件将不会监听 Redux store 。
  - 如果指定了该回调函数中的第二个参数 `ownProps` ，则该参数的值为传递到组件的 `props` ，而且只要组件接收到新的 `props` ， `mapStateToProps` 也会被调用（例如，当 `props` 接收到来自父组件一个小小的改动，那么你所使用的 `ownProps` 参数， `mapStateToProps` 都会被重新计算）。

- `mapDispatchToProps(dispatch, [ownProps]): dispatchProps`
  - 类型： Object 或 Function
  - 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator ，对象所定义的方法名将作为属性名；
  - 每个方法将返回一个新的函数，函数中 `dispatch` 方法会将 action creator 的返回值作为参数执行。这些属性会被合并到组件的 `props` 中。

- `mergeProps(stateProps, dispatchProps, ownProps): props`
  - 类型： Function
  - 如果指定了这个参数，`mapStateToProps()` 与 `mapDispatchToProps()` 的执行结果和组件自身的 `props` 将传入到这个回调函数中。
  - 该回调函数返回的对象将作为 `props` 传递到被包装的组件中。
  - 你也许可以用这个回调函数，根据组件的 `props` 来筛选部分的 `state` 数据，或者把 `props` 中的某个特定变量与 `action` `creator` 绑定在一起。
  - 如果你省略这个参数，默认情况下返回 `Object.assign({}, ownProps, stateProps, dispatchProps)` 的结果。

- `options`
  - 类型： Object
  - 如果指定这个参数，可以定制 `connector` 的行为。
  - 可选参数：
    - `pure`: 布尔值。如果为 `true` ， `connector` 将执行 `shouldComponentUpdate` 并且浅对比 `mergeProps` 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 `state` 而只依赖于 `props` 和 Redux store 的 `state` 。默认值为 `true` 。
    - `withRef`: 布尔值。如果为 `true` ， `connector` 会保存一个对被包装组件实例的引用，该引用通过 `getWrappedInstance()` 方法获得。默认值为 `false` 。

示例：

``` js
// 注入 dispatch 和 targetState
function mapStateToProps(state) {
  return { targetState: state.targetState }
}
export default connect(mapStateToProps)(MyApp)
```

[更多示例](https://www.redux.org.cn/docs/react-redux/api.html#%E5%A4%87%E6%B3%A8)。

### 更多

[更多中间件](https://www.redux.org.cn/docs/introduction/Ecosystem.html#%E4%B8%AD%E9%97%B4%E4%BB%B6)。

[更多工具](https://www.redux.org.cn/docs/introduction/Ecosystem.html#%E5%B7%A5%E5%85%B7%E9%9B%86)

