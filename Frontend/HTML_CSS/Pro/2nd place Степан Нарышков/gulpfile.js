"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var csso = require("gulp-csso");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var imagemin = require('gulp-imagemin');
var rename = require("gulp-rename");
var svgstore = require('gulp-svgstore');
var server = require("browser-sync").create();
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;

var icons = [
  "src/img/arrow.svg",
  "src/img/dots.svg",
  "src/img/user.svg",
  "src/img/home.svg",
  "src/img/car.svg",
  "src/img/pay.svg",
  "src/img/umbrella.svg",
  "src/img/reservations.svg",
  "src/img/purchases.svg",
  "src/img/languages.svg",
  "src/img/conversation.svg",
  "src/img/control.svg",
  "src/img/routines.svg",
  "src/img/email.svg",
  "src/img/mobile.svg",
  "src/img/mini-home.svg",
  "src/img/video.svg",
  "src/img/shopping.svg",
  "src/img/music.svg",
  "src/img/news.svg",
  "src/img/play.svg",
  "src/img/calendar.svg",
  "src/img/reminders.svg",
  "src/img/stocks.svg",
  "src/img/add.svg",
];

gulp.task("css", function () {
  return gulp.src("src/css/index.css")
    .pipe(plumber())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/*.{png,jpg,svg}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("dist"));
});

gulp.task("optim", function () {
  return gulp.src(["src/img/**/*.{png,jpg,svg}", "!src/img/**/logo-*.svg"])
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("dist/img"));
});

gulp.task("img", function () {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(gulp.dest("dist/img"));
});

gulp.task("server", function () {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(icons, gulp.series("sprite", "refresh"));
  gulp.watch("src/css/**/*.css", gulp.series("css"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
});


gulp.task("sprite", function () {
  return gulp.src(icons)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("dist/img"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("js", function () {
  return pipeline(
    gulp.src("src/js/*.js"),
    uglify(),
    gulp.dest("dist/js")
  );
});

gulp.task("clean", function() {
  return del("dist");
});

gulp.task("build", gulp.series("clean", "copy", "css", "html", "js", "optim", "img", "sprite"));
gulp.task("start", gulp.series("build", "server"));
