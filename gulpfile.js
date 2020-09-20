'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');


gulp.task('html', function() {
  return gulp.src('./*.html')
  .pipe(browserSync.reload({stream: true}))
})

gulp.task('css', function() {
  return gulp.src('./css/*.css')
  .pipe(browserSync.reload({stream: true}))
})
gulp.task('js', function() {
  return gulp.src('./js/*.js')
  .pipe(browserSync.reload({stream: true}))
})

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', function(){
    gulp.watch('./css/*.css', gulp.parallel('css'));
    gulp.watch('./*.html', gulp.parallel('html'));
    gulp.watch('./js/*.js', gulp.parallel('js'));
});

gulp.task('default', gulp.parallel('css', 'html', 'js', 'browser-sync', 'watch'))
