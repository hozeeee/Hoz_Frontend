<template>
  <div ref="container">
    <h2>测试 ipc 通信</h2>
    <p>页面可以使用 ipcRenderer 给主进程发送消息。</p>
    <p>页面的 ipcRenderer 是在创建渲染进程时，给 window 对象添加的一个全局属性。（preload.js）</p>
    <p>ipcRenderer 是一个 EventEmitter 的实例。你可以使用它提供的一些方法从渲染进程(web页面)发送同步或异步的消息到主进程。也可以接收主进程回复的消息。</p>
    <p>对于主进程，使用的是 ipcMain 监听接收通道消息或发送消息。</p>
    <div>
      <button @click="handleTest">向electron主进程发送消息</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleTest() {
      renderer_electron.ipcRenderer.send("print", "[this is data from page]");
      alert("主进程的控制台有打印内容");
      renderer_electron.ipcRenderer.once("main_reply", (e, arg) => {
        let div = document.createElement("div");
        div.innerHTML = `这是主进程返回过来的随机数： ${arg}`;
        this.$refs.container.appendChild(div);
      });
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