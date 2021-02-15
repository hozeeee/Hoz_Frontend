const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path') // 主进程引用外部资源必须使用绝对路径
const appMenu = require(path.join(__dirname, './menuConfigs/appMenu.js'))
const contextMenu = require(path.join(__dirname, './menuConfigs/contextMenu.js'))


function createWindow() {



  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    backgroundColor: '#eee',
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // 开启后，为渲染进程提供使用 nodeJs 模块(包括第三方)的能力。("require()"引入模块)
      preload: path.join(__dirname, 'preload.js') // 此文件为页面提供 electron 的对象
    }
  })



  // 是否开发环境
  if (isDev) {
    mainWindow.loadURL('http://localhost:4000') // 使用本地服务
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.resolve(__dirname, '../renderer/dist/index.html')) // 打包文件
  }



  // 创建托管图标
  const appIcon = new Tray(path.join(__dirname, './electron.ico'))
  appIcon.setToolTip('This is my application.')
  // 托管图标菜单
  appIcon.setContextMenu(
    Menu.buildFromTemplate(contextMenu)
  )
  app.____appIcon = appIcon // (注意,需要"引用"该对象,否则创建一段时间后会被垃圾回收)


  // 设置所有窗口顶部的工具栏菜单
  // 也可是使用窗口对象上的 setMenu(menu) 方法针对性的设置菜单
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(appMenu)
  )
}


// 测试 ipc 通信
ipcMain.on("print", (e, arg) => {
  console.log(arg)
  e.reply('main_reply', Math.random())
})






// 当 Electron 完成初始化后，执行此回调函数
app.on('ready', createWindow)
// 当所有窗口都关闭时，退出程序
app.on('window-all-closed', function () {
  // 在 macOS 上，应用程序和它们的菜单栏通常保持活动状态，直到用户明确退出 Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
  // 在 macOS 上，当 dock 图标被点击而没有其他窗口打开时，通常会在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


// 在这个文件中，你可以包含应用程序的其他特定的主进程代码。
// 您也可以将它们放在单独的文件中，并在这里 require 它们。