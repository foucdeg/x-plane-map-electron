const webpack = require('webpack');

const serverConfig = {
  entry: './src/background.js',
  output: {
    filename: './app/background.js',
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
            presets: ['electron', 'es2015'],
          },
        },
      },
    ],
  },
};

const clientConfig = {
  entry: './src/client/index.jsx',
  output: {
    filename: './app/client.js',
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
          'less-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['electron', 'es2015', 'react'],
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'svg-url-loader',
          options: { noquotes: true },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'dev' }),
  ],
};

const setupConfig = { ...clientConfig };
setupConfig.entry = './src/setup/index.jsx';
setupConfig.output = { filename: './app/setup.js' };
setupConfig.plugins = [
  new webpack.EnvironmentPlugin({ NODE_ENV: 'dev' }),
];
setupConfig.target = 'electron';

if (process.env.NODE_ENV === 'production') {
  clientConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
  setupConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = [serverConfig, clientConfig, setupConfig];
