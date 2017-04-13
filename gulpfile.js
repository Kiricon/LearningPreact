const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-ruby-sass');
const cleanCSS = require('gulp-clean-css');
const webpack = require('gulp-webpack');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');


const paths = {
    sass: './src/scss/**/*.scss',
    html: './src/index.html',
    js: './src/js/**/*.js',
};

gulp.task('convertcss', () => {
  return sass(paths.sass)
          .on('error', sass.logError)
          .pipe(cleanCSS())
          .pipe(gulp.dest('./src/css'))
          .pipe(browserSync.stream());
});

gulp.task('buildcss', () => {
  return sass(paths.sass)
          .on('error', sass.logError)
          .pipe(cleanCSS())
          .pipe(gulp.dest('./dist/css'));
});

gulp.task('webpack', () => {
    return gulp.src('./src/js/index.js')
    .pipe(webpack( require('./webpack.config.js')))
    .pipe(gulp.dest('./src/js'));
});
gulp.task('buildwebpack', () => {
    return gulp.src('./src/js/index.js')
    .pipe(webpack( require('./webpack.config.js')))
    .pipe(babel({
            presets: ['es2015'],
        }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('buildHtml', () => {
    gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('buildImages', () => {
    gulp.src('./src/imgs/*')
    .pipe(gulp.dest('./dist/imgs'));
});

gulp.task('watchjs', ['webpack'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('default', () => {
    browserSync.init({
        server: {
        baseDir: './src',
        },
    });

    gulp.watch(paths.html).on('change', browserSync.reload);
    gulp.watch(paths.sass, ['convertcss']);

    gulp.watch(paths.js, ['watchjs']);
});

gulp.task('build',
    ['buildHtml', 'buildwebpack', 'buildcss', 'buildImages'],
    () => {
    console.log('Project Build!');
});