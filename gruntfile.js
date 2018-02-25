module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Clean build folders
        clean: ['dist'],

        // Bundled and minified build
        webpack: {
            bundle: require('./build/webpack.prod')
        },

        // Static files
        copy: {
            license: {
                files: [
                    {
                        expand: true,
                        src: './LICENSE.txt',
                        dest: './dist/unlicensed'
                    },
                    {
                        expand: true,
                        src: './LICENSE.txt',
                        dest: './dist/licensed'
                    }
                ]
            }
        },

        // Replace version string in license
        'string-replace': {
            version: {
                files: {
                    './dist/': ['./dist/**/*.*']
                },
                options: {
                    replacements: [
                        {
                            pattern: /\${VERSION}/g,
                            replacement: require('./package.json').version
                        }
                    ]
                }
            }
        },

        // Create .zip for upload to website
        zip: {
            unlicensed: {
                src: [
                    './dist/unlicensed/archer.min.js',
                    './dist/unlicensed/LICENSE.txt'
                ],
                cwd: './dist/',
                dest: './dist/archer-runtime.zip'
            },
            licensed: {
                src: [
                    './dist/licensed/archer.min.js',
                    './dist/licensed/LICENSE.txt'
                ],
                cwd: './dist/',
                dest: './dist/archer-runtime.licensed.zip'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-zip');

    // Default task(s).
    grunt.registerTask('default', [
        'clean',
        'webpack',
        'copy',
        'string-replace',
        'zip'
    ]);
};
