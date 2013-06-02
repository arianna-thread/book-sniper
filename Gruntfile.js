'use strict';

module.exports = function(grunt) {
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
            test: {
                files: ['<%= yeoman.app %>/lib/**/*.*', 'test/**/*.coffee'],
                tasks: ['coffee', 'jasmine-node']
            },
            // teest: {
            //     files: ['test/spec/{,*/}*.coffee'],
            //     tasks: ['coffee:test']
            // },
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
                        ext: '.js',
                    }
                ]
            }
        },
        nodeunit: {
            all: ['test/plugins/{,*/}*Test.js']
        },
        'jasmine-node': {
            options: {
                coffee: true,
                captureException: true,
                verbose: true
            },
            run: {
                spec: ['test/']
            },

            // env: {
            //     NODE_PATH: 'lib/js'
            // }
        }
    });

    grunt.renameTask('regarde', 'watch');
    // remove when mincss task is renamed

    grunt.registerTask('livetest', [
            'watch'
    ]);


    grunt.registerTask('test', [
        // 'clean:server',
        'coffee',
        // 'compass',
        // 'connect:test',
        'jasmine-node'
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