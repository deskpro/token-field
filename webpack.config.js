var webpack = require('webpack');
var values = require('postcss-modules-values');
var path = require('path');


module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'index.js',
    path: path.resolve('./dist'),
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { plugins: () => [values] } },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};
