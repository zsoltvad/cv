"use strict";

// Required libraries

var gulp    = require( 'gulp' ),
uglify      = require( 'gulp-uglify' ),
sass        = require( 'gulp-sass' ),
imagemin    = require( 'gulp-imagemin' ),
sourcemaps  = require( 'gulp-sourcemaps' ),
del         = require( 'del' ),
argv        = require( 'yargs' ).argv,
browserSync = require( 'browser-sync' ).create();

// Paths

var assetsPath = 'public/assets';
var paths = {
	styles: {
		src: 'assets/stylesheets/**/*.scss',
		dest: assetsPath
	},
	scripts: {
		src: 'assets/scripts/**/*.js',
		dest: assetsPath
	},
	images: {
		src: 'assets/images/**/*',
		dest: assetsPath
	},
	fonts: {
		src: 'assets/fonts/**/*',
		dest: assetsPath
	},
	root: {
		src: 'index.html',
	}
};

// Tasks

gulp.task( 'clean', function() {
	// return del( [ 'public' ] );
} );

gulp.task( 'scripts', [ 'clean' ], function() {

	if ( argv.e !== 'production' ) {
		return gulp.src( paths.scripts.src )
			.pipe( sourcemaps.init() )
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest( paths.scripts.dest ) );
	} else {
		return gulp.src( paths.scripts.src )
			.pipe( uglify() )
			.pipe( gulp.dest( paths.scripts.dest ) );
	}	
} );

gulp.task( 'images', [ 'clean' ], function() {
	return gulp.src( paths.images.src )
		.pipe( imagemin( { optimizationLevel: 5 } ) )
		.pipe( gulp.dest( paths.images.dest ) );
} );

gulp.task( 'styles', [ 'clean' ], function() {

	if ( argv.e !== 'production' ) {
		return gulp.src( paths.styles.src )
			.pipe( sourcemaps.init() )
			.pipe( sass().on( 'error', sass.logError ) )
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest( paths.styles.dest ) )
			.pipe( browserSync.stream() );
	} else {
		return gulp.src( paths.styles.src )
			.pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
			.pipe( gulp.dest( paths.styles.dest ) );
	}
} );

gulp.task( 'fonts', [ 'clean' ], function() {
	return gulp.src( paths.fonts.src )
		.pipe( gulp.dest( paths.fonts.dest ) );
} );

// Watch task

gulp.task( 'watch', function() {

	var port = argv.p || 8080;

	browserSync.init( { proxy: `localhost:${ port }` } );

	gulp.watch( paths.styles.src, [ 'styles' ] );
	gulp.watch( paths.scripts.src, [ 'scripts' ] ).on( 'change', browserSync.reload );
	gulp.watch( paths.images.src, [ 'images' ] ).on( 'change', browserSync.reload );
	gulp.watch( paths.root.src ).on( 'change', browserSync.reload );
} );

// Default task

var defaultTasks = [ 'watch', 'styles', 'scripts', 'images', 'fonts' ];
gulp.task( 'default', ( argv.e !== 'production' ) ? defaultTasks : defaultTasks.splice( 1, 4 ) );
