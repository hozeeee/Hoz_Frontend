<template>
  <div>
    <h2>dialog</h2>
    <p>dialog 是属于主进程的模块。</p>
    <p>用于打开本机系统对话框。</p>
    <hr />
    <button @click="showOpenDialogSync">打开文件的对话框</button>
    <hr />
    <button @click="showSaveDialogSync">保存文件的对话框</button>
    <hr />
    <button @click="showMessageBoxSync">信息框</button>
    <hr />
    <button @click="showErrorBox">错误提示框</button>
    <hr />
  </div>
</template>
<script>
export default {
  methods: {
    showOpenDialogSync() {
      const { dialog } = renderer_electron.remote;
      const currentWin = renderer_electron.remote.getCurrentWindow();
      // 类似的方法还有 "showOpenDialog"
      dialog.showOpenDialog(
        currentWin, // 可选参数，指定后，允许对话框将自身附加到父窗口, 作为父窗口的模态框。
        // 此对象中的所有属性都是可选的
        {
          title: "OpenDialog"
        }
      );
    },

    showSaveDialogSync() {
      const { dialog } = renderer_electron.remote;
      // 类似的方法还有 "showSaveDialog"
      dialog.showSaveDialogSync();
    },

    showMessageBoxSync() {
      const { dialog } = renderer_electron.remote;
      // 类似的方法还有 "showMessageBox"
      dialog.showMessageBoxSync();
    },

    showErrorBox() {
      const { dialog } = renderer_electron.remote;
      // 两个参数都是必须的
      dialog.showErrorBox("这是标题", "这是内容");
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  height: 34px;
  background: #aaa;
  font-weight: bold;
}
</style>