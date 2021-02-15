const {
  VueLoaderPlugin
} = require('vue-loader')

module.exports = {
  mode:'production',
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
    },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}