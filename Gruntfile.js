var path = require('path'),
    connect_livereload = require('connect-livereload');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');

    var ports = {
        server: 8000,
        livereload: 35353
    };

    var dirs = {
        app: 'app',
        build: 'app/.build',
        lib: 'app/lib'
    };

    function mount(connect, dir) {
        return connect.static(path.resolve(dir));
    }

    grunt.initConfig({
        ports: ports,
        dirs: dirs,
        typescript: {
            build: {
                src: [
                    '<%= dirs.app %>/**/*.ts',
                    '!<%= dirs.lib %>/**/*.ts',
                    'typings/*.d.ts',
                    '<%= dirs.lib %>/nullstone/dist/nullstone.d.ts',
                    '<%= dirs.lib %>/minerva/dist/minerva.d.ts',
                    '<%= dirs.lib %>/fayde/dist/fayde.d.ts',
                    '<%= dirs.lib %>/fayde.drawing/dist/fayde.drawing.d.ts',
                    '<%= dirs.lib %>/fayde.utils/dist/fayde.utils.d.ts',
                    '<%= dirs.lib %>/fayde.transformer/dist/fayde.transformer.d.ts',
                    '<%= dirs.lib %>/tween.ts/src/Tween.d.ts',
                    '<%= dirs.lib %>/tone/utils/Typescript/Tone.d.ts'
                ],
                dest: dirs.build,
                options: {
                    basePath: dirs.app,
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: ports.server,
                    base: dirs.app,
                    middleware: function (connect) {
                        return [
                            connect_livereload({ port: ports.livereload }),
                            mount(connect, dirs.build),
                            mount(connect, dirs.app)
                        ];
                    }
                }
            }
        },
        open: {
            serve: {
                path: 'http://localhost:<%= ports.server %>/default.html'
            }
        },
        watch: {
            src: {
                files: [
                    '<%= dirs.app %>/**/*.ts',
                    '!<%= dirs.lib %>/**/*.ts'
                ],
                tasks: ['typescript:build'],
                options: {
                    livereload: ports.livereload
                }
            },
            views: {
                files: [
                    '<%= dirs.app %>/**/*.fap',
                    '<%= dirs.app %>/**/*.fayde'
                ],
                options: {
                    livereload: ports.livereload
                }
            }
        }
    });

    grunt.registerTask('default', ['typescript:build']);
    grunt.registerTask('serve', ['typescript:build', 'connect', 'open', 'watch'])
};