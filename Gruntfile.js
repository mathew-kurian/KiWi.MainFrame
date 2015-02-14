'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            react: {
                files: ['asr/*.jsx', 'asr/**/*.jsx', 'asr/**/*.js'],
                tasks: ['browserify']
            },
            styles: {
                files: ['sass/*.scss'],
                tasks: ['sass']
            }
        },

        sass: {
            dist: {
                options: {
                    sourceMap: false,
                    options: {
                        style: 'expanded'
                    },
                    includePaths: ['sass']
                },
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['**/*.scss'],
                    dest: 'public/css',
                    ext: '.css'
                }]
            }
        },

        browserify: {
            options: {
                transform: [require('grunt-react').browserify]
            },
            client: {
                src: ['asr/*.jsx', 'asr/**/*.jsx', 'asr/**/*.js'],
                dest: 'public/js/bundle.js'
            }
        },
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    watch: ['public/**/*.js', './*.js', 'routes/*.js', 'routes/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', ['sass']);
    grunt.registerTask('default', ['browserify']);
};
