const border = "solid";

export default (prevState = border, action) => {
  if (action.type === 'CHANGE_BORDER_STYLE') {
    if (typeof action.data !== "string") return prevState
    return action.data
  }
  return prevState
}