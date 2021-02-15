const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './index2.scss',
  output: {
    path: path.resolve(__dirname, 'dist_webpack')
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
      }, {
        loader: "sass-loader", // 将 Sass 编译成 CSS
        options: {
          // 设置编译选项，可选参数请看 sassRender.js
          sassOptions: {
            outputStyle: 'nested'
          }
        }
      }]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};