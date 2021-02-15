const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: './index.css',
  output: {
    path: path.resolve(__dirname, 'dist_webpack')
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          }
        },
        {
          loader: 'postcss-loader'
        }
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}