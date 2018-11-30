/**
* Gulpfile to make my life easier.
*/
 
var gulp = require('gulp');
var browserify = require('browserify');
var imgurify = require('imgurify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

gulp.task('es6', function() {
    browserify({
        entries: [require.resolve('@babel/polyfill'), './exports.js'],
        expose: 'Expo2DContext',
        debug: true
    })
    .transform(imgurify)
    .transform(babelify, {presets: ["@babel/preset-env"]})
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source('./dist/bundle.js'))
    .pipe(gulp.dest(''));
});
 
gulp.task('watch',function() {
    gulp.watch('./*.js',['es6'])
});
 
gulp.task('default', ['watch']);
