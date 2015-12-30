var paths = require('../paths');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var fs = require('fs');
var sourceMappingURL = require("source-map-url")
var pkg = require('../package.json');
var autoprefixer = require('autoprefixer');

var webpackConfig = {

    entry: {
        app: paths.entryFile,
        vendor: Object.keys(pkg.dependencies)
    },

    output: {
        path: paths.distDir,
        filename: 'assets/js/[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
    },

    devtool: 'source-map',

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
                loader: ExtractTextPlugin.extract('css?sourceMap!postcss!sass?sourceMap&outputStyle=expanded')
            }
        ]
    },

    eslint: {
        failOnError: true
    },

    postcss: function () {
        return [
            autoprefixer({
                browsers: ['last 2 versions']
            })
        ];
    },

    plugins: [
        new Clean(paths.distDir),

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

        new ExtractTextPlugin('assets/css/app-[chunkhash].css', { allChunks: true }),

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

    fs.readFile(paths.index, 'utf8', callback);
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
        fs.unlinkSync(path.join(paths.distDir, manifestFilename));
    })
}

module.exports = webpackConfig;