const sass = require('node-sass');

module.exports = grunt => {

	require('load-grunt-tasks')(grunt);

	let port = grunt.option('port') || 8000;
	let root = grunt.option('root') || '.';

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		postcss: {
			options: {
				processors: [
					require('tailwindcss')('./tailwind.config.js')
				]
			},
			dist: {
				expand: true,
				cwd: './css',
				src: ['**/*.css'],
				dest: './css',
				ext: '.css'
			}
		},

		uglify: {
			options: {
				ie8: true
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		sass: {
			options: {
				implementation: sass,
				sourceMap: false
			},
			core: {
				src: 'css/reveal.scss',
				dest: 'css/reveal.css'
			},
			custom: {
				src: 'css/custom.scss',
				dest: 'css/custom.css'
			},
			themes: {
				expand: true,
				cwd: 'css/theme/source',
				src: ['*.sass', '*.scss'],
				dest: 'css/theme',
				ext: '.css'
			}
		},

		autoprefixer: {
			core: {
				src: 'css/reveal.css'
			},
			custom: {
				src: 'css/custom.css'
			}
		},

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compress: {
				src: 'css/reveal.css',
				dest: 'css/reveal.min.css'
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				loopfunc: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false,
					require: false
				}
			},
			files: [ 'gruntfile.js', 'js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: root,
					livereload: true,
					open: true,
					useAvailablePort: true
				}
			}
		},

		zip: {
			bundle: {
				src: [
					'index.html',
					'css/**',
					'js/**',
					'lib/**',
					'images/**',
					'plugin/**',
					'**.md'
				],
				dest: 'reveal-js-presentation.zip'
			}
		},

		watch: {
			js: {
				files: [ 'gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'css/theme/source/*.sass',
					'css/theme/source/*.scss',
					'css/theme/template/*.sass',
					'css/theme/template/*.scss'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss', 'css/custom.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: root.map(path => path + '/*.html')
			},
			markdown: {
				files: root.map(path => path + '/*.md')
			},
			options: {
				livereload: true
			}
		}

	});

	grunt.loadNpmTasks('grunt-postcss');

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'sass:custom', 'postcss', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'postcss', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

};
