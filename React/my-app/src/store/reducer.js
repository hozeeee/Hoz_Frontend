const defaultState = {
  inputValue_: '123'
}

export default (prevState = defaultState, action) => {
  if (action.type === 'myActionType') {
    console.log(prevState, defaultState, action)
    let newState = JSON.parse(JSON.stringify(prevState))
    Object.assign(newState, action.data)
    return newState
  }
  return prevState
}