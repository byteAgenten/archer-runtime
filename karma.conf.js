// Karma configuration
// Generated on Wed Jan 14 2015 17:57:40 GMT+0100 (CET)
const path = require('path');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            // Add libraries as webpack entry points
            'bower_components/snap.svg/dist/snap.svg.js',
            'bower_components/jquery/dist/jquery.js',
            // Test files
            'src/**/*.spec.js',
            'tests/**/*.spec.js',
            {pattern: 'tests/**/*.*', included: false}
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.spec.js': ['webpack', 'sourcemap'],
            'tests/**/*.spec.js': ['webpack', 'sourcemap']
        },

        webpack: require('./build/webpack.test'),

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'spec'],

        specReporter: {maxLogLines: 5},

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome_without_security'],

        customLaunchers: {
            Chrome_without_security: {
                base: 'Chrome',
                chromeDataDir: path.join(process.env.HOME, '.chrome-dev'),
                flags: ['--disable-web-security --enable-file-cookies --allow-file-access-from-files —-user-data-dir']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
