const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // 指定入口
  entry: './src/app.js',
  // 指定出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[id].[hash:8].js'
  },
  // 指定模式
  mode: 'production',
  resolve: {
    // 设置某个目录的别名，如，使用 `@` 代替 `*/src` 。
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    // 设置可省略的扩展名，如 `./index.js` 可以写成 `./index`。
    extensions: ['.js', '.json'],
    // 解析目录时要使用的(多个)文件别名，如 `./router/index.js` 可以简写成 `./router`
    mainFiles: ['index']
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.txt$/,
      use: 'raw-loader'
    }]
  },
  devServer: {
    // 主机名，当你有多个网卡的时候，可以指定特定ip
    host: 'localhost',
    // 被作为索引文件的文件名
    index: 'index.html',
    // 代理，表示根路径下的 api 路径开头会被转发到指定地址。除此还有其他写法
    proxy: {
      '^/api': 'http://localhost:3000'
    },
    // 挂载的端口号
    port: 8080,
    // 启用热更新
    hot: true
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // 只在发生错误时输出
  stats: 'errors-only',
  // 指明生产环境，默认'web'
  target: 'web',
  // node.js 的部分模块代码
  node: {
    global: true,
    process: true,
    __filename: 'mock',
  }
}