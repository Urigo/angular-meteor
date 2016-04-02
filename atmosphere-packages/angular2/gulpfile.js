var gulp = require("gulp");
var install = require("gulp-install");
var runSequence = require("run-sequence");

gulp.task("install",function(){
    gulp.src("./package.json").pipe(install());
});

var exec = require("child_process").exec;

gulp.task("typings", function(callback) {
  exec("node ng2-dts-bundle.js", function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task("publish",function(callback) {
  exec("meteor publish --release=1.2.1", function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task("build", function(callback) {
  runSequence("install", "typings", callback);
});
