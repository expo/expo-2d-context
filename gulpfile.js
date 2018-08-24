/**
* Gulpfile to make my life easier.
*/
 
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

// Lets bring es6 to es5 with this.
// Babel - converts ES6 code to ES5 - however it doesn't handle imports.
// Browserify - crawls your code for dependencies and packages them up 
// into one file. can have plugins.
// Babelify - a babel plugin for browserify, to make browserify 
// handle es6 including imports.
gulp.task('es6', function() {
    browserify({
        entries: './exports.js',
        expose: 'Expo2DContext',
        debug: true
    })
    .transform(babelify, {presets: ["es2015"]})
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
