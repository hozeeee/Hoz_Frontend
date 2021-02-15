<template>
  <div>
    <h2>clipboard</h2>
    <p>此模块在主进程也能用。</p>
    <p>用于在系统剪贴板上执行复制和粘贴操作</p>
    <hr />
    <div>
      <span>显示剪贴板的内容：</span>
      <button @click="showClipboardText">显示</button>
    </div>
    <hr />
    <div>
      <span>添加输入框文本到剪贴板：</span>
      <input type="text" v-model="inputTxt" />
      <button @click="writeToClipboard">添加</button>
    </div>
    <hr />
    <div>
      <p>其他方法不做示例,简单列举：</p>
      <p>针对HTML格式的文本： clipboard.readHTML([type]) 、 clipboard.writeHTML(markup[, type])</p>
      <p>针对图片： clipboard.readImage([type]) 、 clipboard.writeImage(image[, type])</p>
      <p>针对RTF： clipboard.readRTF([type]) 、 clipboard.writeRTF(text[, type])</p>
      <p>针对"书签"： clipboard.readBookmark() 、 clipboard.writeBookmark(title, url[, type])</p>
      <p>有关活动应用程序(仅macOS)： clipboard.readFindText() 、 clipboard.writeFindText(text)</p>
      <p>清空： clipboard.clear([type]</p>
      <p>所支持的格式的数组： clipboard.availableFormats([type]) （如，[ 'text/plain', 'text/html' ]）</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputTxt: ""
    };
  },
  methods: {
    showClipboardText() {
      // 此方法可以有一个参数，在 Linux 系统上可以关注此参数
      let txt = renderer_electron.clipboard.readText();
      alert(`剪贴板的文本是： ${txt}`);
    },

    writeToClipboard() {
      // 此方法还有第二个参数，与 clipboard 的参数一样
      renderer_electron.clipboard.writeText(this.inputTxt);
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