var paths = require('../paths');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackOptions = {

    entry: [
        'babel-polyfill',
        'webpack/hot/dev-server',
        paths.entryFile
    ],

    output: {
        filename: 'bundle.js'
    },

    devtool: 'eval-source-map',

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                include: paths.appDir,
                loader: 'eslint'
            }
        ],

        loaders: [
            {
                // ref: http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/
                test: /\.js$/,
                include: paths.appDir,
                loaders: [
                    'babel?presets[]=es2015,plugins[]=transform-runtime', 
                    'virtual-dom'
                ]
            },

            {
                test: /\.scss$/,
                include: paths.appDir,
                loaders: [
                    'style', 
                    'css?sourceMap', 
                    'sass?sourceMap&outputStyle=expanded'
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: paths.index,
            inject: true,
            devServer: 'http://localhost:8080/webpack-dev-server.js'
        }),

        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = webpackOptions;