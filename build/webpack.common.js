const path = require('path');

module.exports = {
    context: path.resolve('./src'),
    module: {
        loaders: [
            // To import Snap we have to provide window as global and remove module.exports so that Snap is forced to define Snap as global
            {
                test: path.resolve('./bower_components/snap.svg/dist/snap.svg.js'),
                loader: 'imports-loader?this=>window,fix=>module.exports=0'
            },
            // Inline SVG loader for watermark SVG
            {
                test: /watermark\.svg$/,
                loader: 'svg-url-loader'
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        alias: {
            'snap-svg': path.resolve('./bower_components/snap.svg/dist/snap.svg.js')
        }
    }
};