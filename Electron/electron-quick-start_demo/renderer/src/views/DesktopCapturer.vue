<template>
  <div>
    <h2>desktopCapturer</h2>
    <p>此部分的介绍请看代码。</p>
    <div class="vidio_container">
      <video id="desktop_capturer"></video>
    </div>
    <div>
      <strong>桌面监控：</strong>
      <button @click="openDesktopCapturer">打开</button>
      <button @click="closeDesktopCapturer">关闭</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    openDesktopCapturer() {
      renderer_electron.desktopCapturer
        // type 表示要捕获的桌面源类型，还有两个可选参数
        .getSources({ types: ["window", "screen"] })
        .then(async sources => {
          console.log("sources", sources);
          for (const source of sources) {
            // 这里的名字不一定是这个
            if (source.name !== "Screen 1") continue;
            try {
              // mediaDevices 是 Navigator 只读属性，返回 MediaDevices 对象，该对象可提供对相机和麦克风等媒体输入设备的连接访问，也包括屏幕共享。
              // MediaDevices.getUserMedia() 在用户通过提示允许的情况下，打开系统上的相机或屏幕共享和/或麦克风，并提供 MediaStream 包含视频轨道和/或音频轨道的输入。
              // getUserMedia() 的参数包含 video 和 audio 两个成员
              const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: source.id,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                  }
                }
              });
              const video = document.getElementById("desktop_capturer");
              // 为 video 添加视频流
              video.srcObject = stream;
              video.onloadedmetadata = () => video.play();
            } catch (e) {
              console.log(e);
            }
          }
        });
    },
    
    closeDesktopCapturer() {
      const video = document.getElementById("desktop_capturer");
      video.srcObject = null;
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  height: 34px;
  background: #aaa;
  font-weight: bold;
  margin: 0 10px;
}

.vidio_container {
  width: 100%;
  height: 400px;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>