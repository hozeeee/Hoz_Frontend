<template>
  <div>
    <h2>shell</h2>
    <p>此模块在主进程也能用。</p>
    <p>作用是，使用默认应用程序管理文件和 url。</p>
    <hr />
    <div>
      <span>打开指定路径的文件夹：</span>
      <input type="text" v-model="dirPath" />
      <button @click="openItem">打开文件夹</button>
    </div>
    <hr />
    <div>
      <span>打开指定路径的文件：</span>
      <input type="text" v-model="filePath" />
      <button @click="showItemInFolder">打开文件</button>
    </div>
    <hr />
    <div>
      <span>使用系统默认的方式打开"外链"：</span>
      <input type="text" v-model="url" />
      <button @click="openExternal">打开外链</button>
    </div>
    <hr />
    <div>
      <span>把指定文件移动到回收站：</span>
      <pre>shell.moveItemToTrash(fullPath[, deleteOnFail])</pre>
    </div>
    <hr />
    <div>
      <button @click="beep">播放哔哔的声音</button>
    </div>
    <hr />
    <div>
      <span>在"shortcutPath"位置创建或更新一个快捷连接 (仅 window 系统)：</span>
      <pre>shell.writeShortcutLink(shortcutPath[, operation], options)</pre>
    </div>
    <hr />
    <div>
      <span>解析"shortcutPath"中的快捷链接 (仅 window 系统)：</span>
      <pre>shell.readShortcutLink(shortcutPath)</pre>
    </div>
    <hr />
  </div>
</template>
<script>
export default {
  data() {
    return {
      dirPath: "",
      filePath: "",
      url: "https://www.electronjs.org/"
    };
  },
  methods: {
    openItem() {
      // 如果参数是空，打开程序所在的文件夹
      let isSucc = renderer_electron.shell.openItem(this.dirPath);
      // 返回打开的结果
      console.log(isSucc);
    },

    showItemInFolder() {
      // 路径不能为空。在文件管理器中显示给定的文件。如果可以, 选中该文件。
      renderer_electron.shell.showItemInFolder(this.filePath);
    },

    openExternal() {
      renderer_electron.shell.openExternal(this.url);
    },

    beep() {
      renderer_electron.shell.beep();
    }
  }
};
</script>
<style scoped>
button {
  height: 34px;
  background: #aaa;
  font-weight: bold;
  margin: 0 10px;
}
</style>