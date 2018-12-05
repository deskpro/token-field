const postcssPresetEnv = require('postcss-preset-env');
const modulesValues = require('postcss-modules-values');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssPresetEnv({ stage: 0 }),
                modulesValues()
              ],
              sourceMap: true,
            },
          },
        ]
      }, {
        test: /node_modules.*.css$/, // A file or folder containing CSS you don't want mangled
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[local]' // This will ensure the classname remains as it is
            }
          },
          'postcss-loader'
        ]
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true, importLoaders: 2 } },
          'sass-loader',
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      }
    ]
  }
};
