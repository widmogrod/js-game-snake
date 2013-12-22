module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/']
        },
        copy: {
            assets: {
                files: [
                    {expand: true, src: ['assets/**', 'index.html'], dest: 'build/'}
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/**']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['js/**'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'game',
                    baseUrl: "js",
                    mainConfigFile: "js/main.js",
                    out: "build/js/optimized.js"
                }
            }
        },
        shell: {                                // Task
            listFolders: {                      // Target
                options: {                      // Options
                    stdout: true
                },
                command: 'ls'
            },
            ghPage: {
                command: 'git status'
            }
        },
        connect: {
            dev: {
                options: {
                    port: 9999,
                    keepalive: true,
                    livereload: true
                }
            }
        },
        concurrent: {
            dev: ['connect:dev', 'watch'],
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-concurrent');


    // Default task(s).
    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('build', ['clean', 'copy', 'requirejs']);
};
