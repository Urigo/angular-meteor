var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('build', function () {
  return gulp.src(['modules/**/*.ts'])
    .pipe(ts({
      target: 'ES5',
      module: 'commonjs',
      experimentalDecorators: true,
      noImplicitAny: false,
      moduleResolution: 'node',
      typescript: require('typescript'),
      emitDecoratorMetadata: true
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);