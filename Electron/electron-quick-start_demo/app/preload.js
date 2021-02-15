// 所有的 Node.js api 在预加载过程中都是可用的。
// 它的沙盒和 Chrome 扩展是一样的。


// 仅渲染进程可用的模块 （也可以单独引入）
const renderer_electron = require('electron');
window.renderer_electron = renderer_electron


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})