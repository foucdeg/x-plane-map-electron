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

const electronClientConfig = {
  entry: './src/client/index.js',
  output: {
    filename: './app/client.js'
  },
  devtool: 'inline-source-map',
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
  }
};

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

module.exports = [ serverConfig, electronClientConfig, setupConfig ];
