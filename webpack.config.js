const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'source/javascripts')
  },
  devtool: 'source-map',
  target: 'web',
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.(css|png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (file) => /\.css$/.test(file)
                ? 'stylesheets/vendor/_[name].[ext]'
                : 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  stats: {
    colors: true
  },
  plugins: []
}
