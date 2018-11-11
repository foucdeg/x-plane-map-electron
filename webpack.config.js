const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const serverConfig = {
  entry: './src/background.js',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'app'),
  },
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['electron'],
          },
        },
      },
    ],
  },
};

const clientConfig = {
  entry: './client/src/index.jsx',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'app'),
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
            presets: ['env', 'react'],
            plugins: ['transform-object-rest-spread', 'transform-class-properties'],
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
    modules: ['./client/node_modules'],
    alias: {
      leaflet: 'leaflet/dist/leaflet.js',
    },
  },
  plugins: [
    new webpack.DefinePlugin({ PLATFORM: JSON.stringify('electron') }),
  ],
};

const setupConfig = { ...clientConfig };
setupConfig.entry = './setup/index.jsx';
setupConfig.output = {
  filename: 'setup.js',
  path: path.resolve(__dirname, 'app'),
};
setupConfig.plugins = [
  new webpack.EnvironmentPlugin({ NODE_ENV: 'dev' }),
];
setupConfig.target = 'electron-renderer';

if (process.env.NODE_ENV === 'production') {
  clientConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
  setupConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

if (process.env.ANALYZE_BUNDLE) {
  clientConfig.plugins.push(new BundleAnalyzerPlugin());
  setupConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = [serverConfig, clientConfig, setupConfig];
