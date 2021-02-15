const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.join(__dirname, 'dist')
  },
  // 方便查看打包后的代码
  mode: 'none',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: path.resolve(__dirname, '/node_modules'),
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      filename: path.join(__dirname, 'dist/index.html')
    })
  ]
}