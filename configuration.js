/* global __dirname */

'use strict';

var path           = require('path');
var srcDir         = path.join(__dirname, 'src');
var distDir        = path.join(__dirname, 'dist');
var appDir         = path.join(srcDir, 'app');
var entryFile      = path.join(appDir, 'index.js');
var index          = path.join(srcDir, 'index.html');

var configuration = {

    paths: {
        entryFile: entryFile,
        distDir: distDir,
        appDir: appDir,
        index: index
    },

    vendorsToBundleSeperately: [
        'babel-polyfill',
        'rx',
        'jquery',
        'virtual-dom'
    ]
};

module.exports = configuration;