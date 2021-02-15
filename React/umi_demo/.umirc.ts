/* ---------------------------------------------------------------------------------
【在此文件中配置项目和插件】
如果配置比较复杂需要拆分，可以放到 config/config.ts 中，并把配置的一部分拆出去，比如路由。
.umirc.ts 优先级比 config/config.ts 更高。

可以新建 .umirc.local.ts，这份配置会和 .umirc.ts 做 deep merge 后形成最终配置。
注意：.umirc.local.ts 仅在 umi dev 时有效。umi build 时不会被加载。
.local.ts 配置的优先级最高，比 UMI_ENV 指定的配置更高。

可以通过环境变量 UMI_ENV 区分不同环境来指定配置。
例如：指定 UMI_ENV=cloud 时， .umirc.cloud.js 会生效。
----------------------------------------------------------------------------------- */

// defineConfig 的作用是提供 TS 的语法检测
import { defineConfig } from 'umi';
// 路由配置拆分
import routes from './config/routes';

export default defineConfig({
  title: 'hi',
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  // 使用 pro-layout (先安装: yarn add @ant-design/pro-layout)
  layout: {
    // 注意，上面的 routes 的配置项中，必须带有 name 属性，否则不会显示
    // 更多配置请查阅 https://prolayout.ant.design/
  },

  //
  // plugins: [
  //   'request',
  // ],
});
