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
    context: `${__dirname}/src`,
    entry: {
      'playkit-call-to-action': 'index.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: ['KalturaPlayer', 'plugins']
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json'
          },
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  namedExport: true
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    devServer: {
      static: `${__dirname}/src`
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: plugins,
    externals: {
      preact: 'root KalturaPlayer.ui.preact',
      'preact/hooks': 'root KalturaPlayer.ui.preactHooks',
      '@playkit-js/kaltura-player-js': 'root KalturaPlayer'
    }
  };
};
