'use strict';

const gulp = require('gulp');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const svgcss = require('gulp-svg-css');
const svgmin = require('gulp-svgmin');

gulp.task('css', function () {
  var plugins = [
    autoprefixer({
      browsers: ['last 2 version']
    }),
    cssnano()
  ];
  return gulp.src('./src/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', () => {
  gulp.src('./src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('js', () =>
  gulp.src('./src/main.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/'))
)

gulp.task('svg', function () {
  return gulp
    .src('./src/images/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgcss({
      fileName: 'icons',
      cssPrefix: 'i-',
      addSize: false
    }))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('dist/'));
});


gulp.task('default', function () {
  gulp.watch('./src/*.css', ['css']);
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/*.js', ['js']);
});