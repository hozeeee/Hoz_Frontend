<template>
  <div>
    <h2>remote</h2>
    <p>remote 使渲染进程中使用主进程模块。（内部还是跟IPC有关）</p>
    <p>如果远程对象在渲染进程中泄露（例如存储在映射中，但从未释放），则主进程中的相应对象也将被泄漏，所以您应该非常小心，不要泄漏远程对象。</p>
    <div>
      <button @click="handleOpenNewWindow">利用 remote 打开一个新的窗口</button>
      <button @click="testBrowserView">BrowserView</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleOpenNewWindow() {
      const { BrowserWindow } = renderer_electron.remote;
      let currentWin = renderer_electron.remote.getCurrentWindow();
      let win = new BrowserWindow({
        width: 800,
        height: 600,
        // 自动隐藏菜单 (Alt显示)
        autoHideMenuBar: true,
        // 还可以指定父窗口 （子窗口将总是显示在父窗口的顶部）
        parent: currentWin,
        // 开启模态窗口模式 （模态窗口是禁用父窗口的子窗口，父窗口不能选中。前提必须设置 parent 属性）
        modal: true
      });
      win.loadURL("https://www.baidu.com");
    },

    testBrowserView() {
      const { BrowserView, BrowserWindow } = renderer_electron.remote;
      let win = new BrowserWindow({
        width: 800,
        height: 800,
        autoHideMenuBar: true,
        title: "BrowserViews"
      });
      win.on("closed", () => {
        win = null;
      });
      // BrowserView 被用来让 BrowserWindow 嵌入更多的 web 内容。
      let view1 = new BrowserView(),
        view2 = new BrowserView(),
        view3 = new BrowserView(),
        view4 = new BrowserView();
      win.addBrowserView(view1);
      win.addBrowserView(view2);
      win.addBrowserView(view3);
      win.addBrowserView(view4);
      view1.setBounds({ x: 0, y: 0, width: 400, height: 400 });
      view2.setBounds({ x: 400, y: 0, width: 400, height: 400 });
      view3.setBounds({ x: 0, y: 400, width: 400, height: 400 });
      view4.setBounds({ x: 400, y: 400, width: 400, height: 400 });
      view1.webContents.loadURL("https://www.baidu.com");
      view2.webContents.loadURL("https://developer.mozilla.org/");
      view3.webContents.loadURL("https://cn.vuejs.org/");
      view4.webContents.loadURL("https://electronjs.org/");
    }
  }
};
</script>
<style scoped>
button {
  height: 34px;
  background: #aaa;
  font-weight: bold;
}
</style>