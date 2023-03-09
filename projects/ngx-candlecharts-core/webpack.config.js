const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'core'),
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'index.html'
  })],
  devServer: {
    static: {
      directory: path.join(__dirname, 'core'),
    },
    compress: true,
    port: 8080,
  },
};