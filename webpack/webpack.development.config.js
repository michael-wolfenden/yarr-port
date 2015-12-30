var config = require('../configuration');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackOptions = {

    entry: [
        'babel-polyfill',
        'webpack/hot/dev-server',
        config.paths.entryFile
    ],

    output: {
        filename: 'bundle.js'
    },

    devtool: 'eval-source-map',

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                include: config.paths.appDir,
                loader: 'eslint-loader'
            }
        ],

        loaders: [
            {
                // ref: http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/
                test: /\.js$/,
                include: config.paths.appDir,
                loaders: [
                    'babel?presets[]=es2015,plugins[]=transform-runtime',
                    'virtual-dom'
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: config.paths.index,
            inject: true,
            devServer: 'http://localhost:8080/webpack-dev-server.js'
        }),

        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = webpackOptions;