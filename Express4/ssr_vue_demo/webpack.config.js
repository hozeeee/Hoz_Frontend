const path = require('path')
const {
  VueLoaderPlugin
} = require('vue-loader')

module.exports = {
  entry: {
    "entry-server": './src/entry-server.js',
    "entry-client": './src/entry-client.js',
  },
  // 指定出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  mode: 'production',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.json', '.vue'],
    mainFiles: ['index']
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    }]
  },
  // 提取公共模块
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  // 只在发生错误时输出
  stats: 'errors-only',
  // target: (compiler) => {
  //   console.log(compiler)
  //   return 'node'
  // }
  target: 'node'
}