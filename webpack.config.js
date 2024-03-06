const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.html'
    })
  ],
//   mode: 'development',
  entry: path.resolve(__dirname, 'src') + '/js/index.js',
  plugins: [new MiniCssExtractPlugin()],
  module: {
	rules: [
	  {
		test: /\.css$/,
		use: [
		  'style-loader',
		  'css-loader',
		],
	  },
	],
  },


}
