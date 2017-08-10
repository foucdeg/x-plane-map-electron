module.exports = {
  entry: './src/app.js',
  output: {
    filename: './app/app.js'
  },
  devtool: 'inline-source-map',
  target: 'electron',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
