import bgColor from "./bgColor"
import borderStyle from "./borderStyle"
import {
  createStore,
  combineReducers
} from 'redux'


// 合并 reducer
const reducers = combineReducers({
  bgColor,
  borderStyle
})

// 创建 store
const store = createStore(reducers)


export default store