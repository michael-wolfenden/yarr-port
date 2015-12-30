var config = require('../configuration');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var fs = require('fs');
var sourceMappingURL = require("source-map-url")

var webpackConfig = {

    entry: {
        app: config.paths.entryFile,
        vendor: config.vendorsToBundleSeperately
    },

    output: {
        path: config.paths.distDir,
        filename: 'assets/js/[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
    },

    devtool: 'source-map',

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

    eslint: {
        failOnError: true
    },

    plugins: [
        new Clean(config.paths.distDir),

        new webpack.NamedModulesPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),

        new HtmlWebpackPlugin({
            inject: true,
            excludeChunks: ['manifest'],
            templateContent: addManifestChunckContentsToIndexTemplate
        }),

        function () {
            this.plugin('done', deleteManifestFiles);
        }
    ]
};

function addManifestChunckContentsToIndexTemplate(templateParams, compilation, callback) {
    var manifestFilename = getGeneratedFilenamesForChunk(compilation.getStats(), 'manifest')[0];
    var manifestSource = compilation.assets[manifestFilename].source();

    // manifestSource will include the //# sourceMappingURL line if including sourcemaps so we need to remove
    templateParams.htmlWebpackPlugin.options.webpackManifest = sourceMappingURL.removeFrom(manifestSource);

    fs.readFile(config.paths.index, 'utf8', callback);
}

function getGeneratedFilenamesForChunk(stats, chunkName) {
    // if including sourcemaps assets will return an array with
    // the filename of the asset and the filename of the assets 
    // sourcemap, else just a string with the filename of the asset
    // for example:
    // ['assets/js/manifest.ade6990fa0a5efdc7b57.js', 'assets/js/manifest.ade6990fa0a5efdc7b57.js.map'] vs
    // 'assets/js/manifest.ade6990fa0a5efdc7b57.js'

    var assets = stats.toJson().assetsByChunkName[chunkName];
    if (Array.isArray(assets)) return assets;
    return assets.split();
}

function deleteManifestFiles(stats) {
    var manifestFilenames = getGeneratedFilenamesForChunk(stats, 'manifest');
    manifestFilenames.forEach(function (manifestFilename) {
        fs.unlinkSync(path.join(config.paths.distDir, manifestFilename));
    })
}

module.exports = webpackConfig;