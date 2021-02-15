<template>
  <div>
    <h2>webFrame</h2>
    <p>提供控制渲染页面的能力，例如缩放页面。</p>
    <hr />
    <p>
      <span>当前缩放级别：</span>
      <span class="factor_value">{{ Math.round(factor*100) }}%</span>
    </p>
    <div>
      <button @click="handleZoomOn">放大</button>
      <button @click="handleZoomOut">缩小</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      factor: renderer_electron.webFrame.getZoomFactor()
    };
  },
  methods: {
    handleZoomOn() {
      this.factor += 0.1;
      renderer_electron.webFrame.setZoomFactor(this.factor);
    },
    handleZoomOut() {
      this.factor -= 0.1;
      renderer_electron.webFrame.setZoomFactor(this.factor);
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
.factor_value {
  border-bottom: 1px solid #999;
  font-weight: bold;
}
</style>