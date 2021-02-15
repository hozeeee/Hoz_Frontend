import dva from 'dva';
import './index.css';

// 创建应用，返回 dva 实例。
const app = dva({
  // 还有如下配置项，具体看官网介绍：
  // history,
  // initialState,
  // onError,
  // onAction,
  // onStateChange,
  // onReducer,
  // onEffect,
  // onHmr,
  // extraReducers,
  // extraEnhancers,
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/homeState').default);
// app.model(require('./models/todoListState').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
