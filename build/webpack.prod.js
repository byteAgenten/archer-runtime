const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const baseConfig = require('./webpack.common');

const licenseBanner = fs.readFileSync('./license-banner.txt', 'utf-8');

const commonProdConfig = {
    entry: {
        'archer': [
            'snap-svg',
            './iag/client/client.js'
        ],
        'archer.min': [
            'snap-svg',
            './iag/client/client.js'
        ]
    },
    output: {
        filename: '[name].js',
        library: 'archer',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.BannerPlugin(licenseBanner),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/
        })
    ]
};

module.exports = [
    // Unlicensed version - includes watermark
    webpackMerge(baseConfig, commonProdConfig, {
        output: {
            path: path.resolve('./dist/unlicensed')
        }
    }),
    // Licensed version - no watermark
    webpackMerge(baseConfig, commonProdConfig, {
        output: {
            path: path.resolve('./dist/licensed')
        },
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/iag(\\|\/)client(\\|\/)watermark\.js/, 'watermark.removed.js')
        ]
    }),
];
