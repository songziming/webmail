var gulp = require('gulp');


var sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload');

var config = {
	styles: {
		root: '/',
		sassPath: 'dev/scss/pages',
		sassFiles: 'dev/scss/pages/*.scss',
		cssDir: 'static/css',
		watchFiles : 'dev/scss/**/*.scss',
		distDir: 'static/css/pages'
	},
	scripts: {
		root: 'dev/js',
		scriptFiles: 'dev/js/script/*.js',
		cssDir: 'static/css',
		distDir: 'static/js/script'
	},
	jade: {
		root: 'app/views',
		jadeFiles: 'app/views/**/*.jade'
	},
	test: {
		root: 'test',
		files: 'test/**/*-spec.js',
		casperFiles: ['test/components/tooltip-casper.js'],
		reporter: 'spec'
	},
	livereload: {

	},
	connect: {
		livereload: true
	},
	images : {
		root: 'dev/img',
		imgFiles: 'dev/img/**/*',
		cssDir: 'static/css',
		distDir: 'static/img'
	}
};

// sass -> css > .min
gulp.task('styles', function() {
	return sass( config.styles.sassPath, { style: 'expanded' })
		.pipe(gulp.dest(config.styles.distDir))
		.pipe(livereload())
		.pipe(notify({ message: 'SCSS编译完成' }));
});

// js -> .min
gulp.task('scripts', function() {
	return gulp.src(config.scripts.scriptFiles)
		// .pipe(jshint('.jshintrc'))
		// .pipe(jshint.reporter('default'))
		.pipe(gulp.dest(config.scripts.distDir))
//		.pipe(rename({
//			suffix: '.min'
//		}))
//		.pipe(uglify())
		.pipe(gulp.dest(config.scripts.distDir))
		.pipe(notify({ message: '脚本处理完成' }))
		.pipe(livereload());
});

gulp.task('images', function() {
	return gulp.src(config.images.imgFiles)
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(config.images.distDir))
		.pipe(notify({ message: '图像压缩完成' }));
});

// jade
gulp.task('jade', function() {
	return gulp.src(config.jade.root)
		.pipe(livereload());
});



// watch file changes, then run tasks
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(config.styles.watchFiles, ['styles']);
	gulp.watch(config.scripts.scriptFiles, ['scripts']);
//	gulp.watch(config.jade.jadeFiles, ['jade']);
});

gulp.task('dev', function() {
	gulp.start('watch');
});