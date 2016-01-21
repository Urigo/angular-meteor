var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('build', function () {
  return gulp.src(['modules/**/*.ts'])
    .pipe(ts(require('./tsconfig.json').compilerOptions))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);