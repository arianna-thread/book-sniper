'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: '.',
        // dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/lib/{,*/}*.coffee'],
                tasks: ['coffee']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
        },
        clean: {
            models: ['.tmp', '<%= yeoman.dist %>/*'],
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', '<%= yeoman.app %>/lib/{,*/}*.js']
        },
        coffee: {
            models: {
                files: [{
                    expand: true,
                    cwd: 'lib/models/coffee',
                    src: '*.coffee',
                    dest: 'lib/models/',
                    ext: '-build.js',
                }]
            },
        },
        nodeunit: {
            all: ['test/plugins/{,*/}*Test.js']
        }
    });

    grunt.renameTask('regarde', 'watch');
    // remove when mincss task is renamed



    grunt.registerTask('test', [
        'clean:server',
        'coffee',
        'compass',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'test',
        'coffee',
        'compass:dist',
        'useminPrepare',
        'imagemin',
        'cssmin',
        'htmlmin',
        'concat',
        'copy',
        'cdnify',
        'usemin',
        'ngmin',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);
};
