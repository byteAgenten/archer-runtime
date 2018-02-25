const path = require('path');
const webpackMerge = require('webpack-merge');

const baseConfig = require('./webpack.common');

module.exports = webpackMerge(baseConfig, {
    resolve: {
        root: [
            path.resolve('./src'),
            path.resolve('./tests')
        ]
    },
    devtool: 'inline-source-map'
});
