const path = require('path');

module.exports = {
  entry: './index.less',
  output: {
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        // 请关注打包后的 396 行。
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }]
  },
  mode: "none"
}