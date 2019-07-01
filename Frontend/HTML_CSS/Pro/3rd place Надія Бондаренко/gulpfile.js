const
    gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    sourcemaps   = require('gulp-sourcemaps'),
    del          = require('del'),
    argv         = require('yargs').argv,
    gulpif       = require('gulp-if'),
	plumber      = require('gulp-plumber'),
	imagemin     = require('gulp-imagemin'),
	svgSprite    = require('gulp-svg-symbols');

const isProduction = (argv.prod === undefined) ? false : true;

const buildDir = './dist';

const path = {
    buildDir: buildDir,

    html: {
        src:   'src/**/*.html',
        watch: 'src/**/*.html',
        build: buildDir + '/'
    },
    css: {
        src:   'src/css/*.css',
        watch: 'src/css/*.css',
        build: buildDir + '/css/'
	},
	svg: {
		src: 'src/svg/*',
		watch: 'src/svg/*',
		build: buildDir + '/img/sprite'
	},
	img: {
		src: 'src/img/**/*.*',
		build: buildDir + '/img/'
	},
};

gulp.task('sprite', function () {
	return gulp
		.src(path.svg.src)
		.pipe(svgSprite ())
		.pipe(gulp.dest(path.svg.build));
});

gulp.task('img', function () {
	return gulp.src(path.img.src)                 
		.pipe(gulpif(isProduction, imagemin([    
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		])))
		.pipe(gulp.dest(path.img.build))  
		.pipe(browserSync.reload({ stream: true }));
});


gulp.task('html', function () {
    gulp.src(path.html.src)
        .pipe(gulp.dest(path.html.build))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scss', function(){
    gulp.src(path.css.src)
        .pipe(autoprefixer({
			grid: true,
			browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(isProduction, cleanCSS()))
        .pipe(gulp.dest(path.css.build))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('cleanDist', function () {
    return del.sync(path.buildDir);
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: path.buildDir,
          },
        notify: false
    });
});

gulp.task('watch', function(){
    gulp.watch(path.html.watch, ['html']);
	gulp.watch(path.css.watch, ['scss']);
	gulp.watch(path.css.build, browserSync.reload);
	gulp.watch(path.img.src, ['img']);
});

gulp.task('build', ['cleanDist', 'html', 'img', 'scss', 'sprite']);

gulp.task('default', ['build', 'browserSync', 'watch']);
