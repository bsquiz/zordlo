module.exports = {
  watch: true,
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mp3)$/i,
        loader: 'file-loader'
      }
    ]
  }
};