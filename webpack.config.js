const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

module.exports = (env, { mode }) => {
  return {
    target: 'web',
    entry: './src/index.ts',
    optimization: {
      minimize: mode !== 'development'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { configFile: mode === 'development' ? 'tsconfig.dev.json' : 'tsconfig.json' },
          exclude: /node_modules/
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
                  localIdentName: '[local]',
                  namedExport: true
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: mode === 'development'
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
      clean: true
    },
    plugins: plugins,
    externals: {
      '@playkit-js/playkit-js': ['KalturaPlayer', 'core'],
      '@playkit-js/kaltura-player-js': ['KalturaPlayer'],
      preact: 'root KalturaPlayer.ui.preact'
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'src')
      },
      client: {
        progress: true
      }
    }
  };
};
