// webpack.config.js 파일
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    tutorial:'./statics/js/three_tutorial.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_bundle.js'
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use:[
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  }
};