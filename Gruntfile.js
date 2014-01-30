module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/']
        },
        copy: {
            assets: {
                files: [
                    {expand: true, src: ['assets/**', 'index.html', 'js/require.js', 'js/main.js'], dest: 'build/'}
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
            },
            styles: {
                files: ['assets/main.css']
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'main',
                    // name: 'game',
                    // name: 'shape/shape/interface',
                    baseUrl: "js",
                    mainConfigFile: "js/main.js",
                    out: "build/js/main.js"
                }
            }
        },
        shell: {
            install: {
                options: {
                    stdout: true
                },
                command: 'bower install && npm install'
            },
            update: {
                options: {
                    stdout: true
                },
                command: 'bower update && npm update'
            },
            ghPages: {
                options: {
                    stdout: true
                },
                command: [
                    'git checkout gh-pages',
                    'cp -R build/* .',
                    'rm -rf build',
                    'git commit -am "new realise"',
                    'git push origin gh-pages',
                    'git checkout master -f'
                ].join(' && ')
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
        jade: {
            dev: {
                options: {
                    data: {
                        baseUrl: ''
                    }
                },
                files: {
                    "index.html": "index.jade"
                }
            },
            build: {
                options: {
                    data: {
                        baseUrl: 'http://widmogrod.github.io/js-game-snake/'
                    }
                },
                files: {
                    "build/index.html": "index.jade"
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
    grunt.registerTask('default', ['jade:dev', 'concurrent:dev']);
    grunt.registerTask('build', ['clean', 'copy', 'requirejs', 'jade:build']);
    grunt.registerTask('deploy', ['build', 'shell:ghPages']);
    grunt.registerTask('install', ['shell:install']);
    grunt.registerTask('update', ['shell:update']);
};
