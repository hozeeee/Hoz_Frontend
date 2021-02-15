const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, 'dist');
try {
  fs.accessSync(distPath);
} catch (e) {
  fs.mkdirSync(distPath);
}

module.exports = {
  entry: './app.js',
  output: {
    path: distPath
  },
  mode: "production",
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        // eslint options (if necessary)
      }
    }]
  }
}