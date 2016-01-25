var gulp = require('gulp');
var ts = require('gulp-typescript');
var flatten = require('gulp-flatten');
var merge = require('merge2');

gulp.task('build', ['copy'], function () {
  var tsResult =  gulp.src(['modules/**/*.ts'])
    .pipe(ts(require('./tsconfig.json').compilerOptions));

  return merge([
    tsResult.dts.pipe(gulp.dest('./')),
    tsResult.js.pipe(gulp.dest('./'))
  ]);
});

gulp.task('copy', function() {
  return gulp.src(['modules/*.ts'])
    .pipe(flatten())
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);