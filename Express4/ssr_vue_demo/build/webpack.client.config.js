const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
 
const path = require('path');
const root= path.resolve(__dirname, '..');
module.exports = merge(baseConfig, {
  entry: path.join(root, 'src/entry-client.js'),
  output: {
    path: path.join(root, 'dist'),
    filename: 'bundle.client.js'
  },
  plugins: [
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   filename: 'manifest.js',
    //   minChunks: Infinity
    // }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ],
  
  // 提取公共模块
  optimization: {
    splitChunks: {
      name: 'manifest',
      filename: 'manifest.js',
      minChunks: Infinity
    }
  },
})