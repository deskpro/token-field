var values = require('postcss-modules-values');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { plugins: () => [values] } },
        ]
      }
    ]
  }
};
