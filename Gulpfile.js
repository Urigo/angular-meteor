var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('build', function () {
  var tsResult =  gulp.src(['modules/**/*.ts'])
    .pipe(ts(require('./tsconfig.json').compilerOptions));

  return merge([
    tsResult.dts.pipe(gulp.dest('./')),
    tsResult.js.pipe(gulp.dest('./'))
  ]);
});

gulp.task('default', ['build']);