var paths = require('../paths');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
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
            },

            {
                test: /\.json$/,
                loaders: [
                    'json'
                ]
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
        new CleanWebpackPlugin(paths.distDir),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        
        new webpack.NamedModulesPlugin(),

        new HtmlWebpackPlugin({
            inject: true,
            excludeChunks: ['manifest'],
            templateContent: addManifestChunckContentsToIndexTemplate,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),

        new ExtractTextPlugin('assets/css/app-[chunkhash].css', { allChunks: true }),
        
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};

function addManifestChunckContentsToIndexTemplate(templateParams, compilation, callback) {
    Object.keys(compilation.assets)
        .filter(function (key) {
            return key.indexOf('manifest.') !== -1;
        })
        .forEach(function (manifestAsset) {
            var isManifestSourceMap = manifestAsset.indexOf('.map') !== -1;
            if (!isManifestSourceMap) {
                // manifestSource will include the //# sourceMappingURL line if including sourcemaps so we need to remove
                var manifestSource = compilation.assets[manifestAsset].source();
                templateParams.htmlWebpackPlugin.options.webpackManifest = sourceMappingURL.removeFrom(manifestSource);
            }

            delete compilation.assets[manifestAsset];
        });

    fs.readFile(paths.index, 'utf8', callback);
};

module.exports = webpackConfig;