const webpack = require('webpack');
const path = require('path');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'src/build');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
	entry: APP_DIR + '/index.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: 'src/www',  //Relative directory for base of server
		devtool: 'eval',
		hot: true,        //Live-reload
		inline: true,
		port: 3000,        //Port Number
		host: '0.0.0.0',  //Change to '0.0.0.0' for external facing server
		historyApiFallback: true
	},
	plugins: [
		//Moves files
		new TransferWebpackPlugin([
			{ from: 'www' }
		], path.resolve(__dirname, "src")),
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ["babel-loader"]
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	}
};

module.exports = config;