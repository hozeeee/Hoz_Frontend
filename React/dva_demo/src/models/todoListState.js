let listData = []
for (let i = 0; i < 16; i++) {
  listData.push(Math.round(Math.random() * 1000))
}

export default {
  namespace: "todoListState",

  state: {
    listData
  },

  reducers: {
    delItem(state, action) {
      return {
        ...state,
        listData: state.listData.filter(i => i !== action.item)
      }
    }
  }


}
