const webpack = require('webpack');

const serverConfig = {
  entry: './src/background.js',
  output: {
    filename: './app/background.js'
  },
  target: 'electron',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['electron', 'es2015']
          }
        }
      }
    ]
  }
};

let clientConfig = {
  entry: './src/client/index.js',
  output: {
    filename: './app/client.js'
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['electron', 'es2015', 'react']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ]
};
if (process.env.NODE_ENV === 'production') {
  clientConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

const setupConfig = {
  entry: './src/client/setup.js',
  output: {
    filename: './app/setup.js'
  },
  devtool: 'inline-source-map',
  target: 'electron',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['electron', 'es2015']
          }
        }
      }
    ]
  }
}

module.exports = [ serverConfig, clientConfig, setupConfig ];
