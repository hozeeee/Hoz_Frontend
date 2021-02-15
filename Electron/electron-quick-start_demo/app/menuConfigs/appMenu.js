// 在app.on('ready')的回调里添加
// Menu.setApplicationMenu(menu)

module.exports = [{
    label: '菜单1'
  },
  {
    label: '菜单2',
    submenu: [{
      label: '最小化',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: '关闭',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      type: 'separator'
    }, {
      label: '重新打开窗口',
      accelerator: 'CmdOrCtrl+Shift+T',
      enabled: false,
      key: 'reopenMenuItem',
      click: function () {
        app.emit('activate')
      }
    }]
  },
  {
    label: '菜单3'
  }
]