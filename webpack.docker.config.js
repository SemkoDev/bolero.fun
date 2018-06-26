const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { spawn } = require('child_process');
const config = require('config');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const MODULES = path.resolve(__dirname, 'node_modules');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR, path.join(MODULES, 'semantic-ui-css')];

module.exports = {
	entry: SRC_DIR + '/index.js',
	output: {
		path: OUTPUT_DIR,
		publicPath: '/',
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
				include: defaultInclude,
			},
			{
				test: /\.jsx?$/,
				use: [{ loader: 'babel-loader' }],
				include: defaultInclude,
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude,
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude,
			},
		],
	},
	target: 'web',
	plugins: [
		new HtmlWebpackPlugin({
			title: config.app.title,
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
		new webpack.DefinePlugin({
			//double stringify because node-config expects this to be a string
			'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(config)),
		}),
	],
	devtool: 'cheap-source-map',
	devServer: {
		contentBase: OUTPUT_DIR,
		stats: {
			colors: true,
			chunks: false,
			children: false,
		},
		setup() {
			spawn('node', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
				.on('close', code => process.exit(0))
				.on('error', spawnError => console.error(spawnError));
		},
	},
};
