const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');

module.exports = (env, { mode }) => {
  return {
    target: 'web',
    entry: './src/index.ts',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(tsx?|js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    bugfixes: true
                  }
                ],
                ['@babel/preset-typescript', { jsxPragma: 'h', jsxPragmaFrag: 'Fragment' }]
              ],
              plugins: [
                ['@babel/plugin-transform-runtime'],
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-transform-react-jsx', { pragma: 'h', pragmaFrag: 'Fragment' }]
              ]
            }
          }
        },
        {
          test: /\.scss/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: true,
                modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                  namedExport: true
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // sourceMap: mode === 'development'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'playkit-document-player.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        umdNamedDefine: true,
        name: ['KalturaPlayer', 'plugins', 'playkit-document-player'],
        type: 'umd'
      },
      clean: true
    },
    externals: {
      '@playkit-js/kaltura-player-js': 'root KalturaPlayer',
      '@playkit-js/playkit-js-ui': 'root KalturaPlayer.ui',
      '@playkit-js/playkit-js': 'root KalturaPlayer.core',
      preact: 'root KalturaPlayer.ui.preact',
      'preact-i18n': 'root KalturaPlayer.ui.preacti18n'
    },
    devServer: {
      static: `${__dirname}/src`
    },
    plugins: [
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageData.version),
        __NAME__: JSON.stringify(packageData.name)
      })
    ]
  };
};
