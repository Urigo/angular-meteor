var gulp = require("gulp");
var webpack = require("gulp-webpack");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var merge = require("merge-stream");
var filenames = require("gulp-filenames");
var print = require("gulp-print");
var filter = require("gulp-filter");
var gulpTypings = require("gulp-typings");
var git = require('gulp-git');
var fs = require('fs');
 
// Install typings.
gulp.task("typings",function(){
  return ! fs.existsSync("./typings") ?
    gulp.src("./typings.json")
      .pipe(gulpTypings()) : null;
});

// Build TypeScript.
gulp.task("webpack", function() {
  var build = gulp.src("modules/*")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("build/"));

  var move = gulp.src("build/modules/*")
    .pipe(gulp.dest("build/"));

  return merge(build, move);
});

gulp.task("build-clean", function() {
  return gulp.src("build/modules")
    .pipe(clean());
});

gulp.task("git-add", function(){
  return gulp.src("build/*")
    .pipe(git.add());
});

gulp.task("build", function(callback) {
  runSequence("typings", "webpack", "build-clean", "git-add", callback);
});

// Move files from build/ to ./ before NPM publish.
gulp.task("pre-publish", function() {
  return gulp.src("build/*")
    .pipe(gulp.dest("./"));
});

// Get file names in build/
gulp.task("get-names", function() {
  return gulp.src("build/*")
    .pipe(filenames("build"));
});

// Remove files from ./ after NPM publish.
gulp.task("publish-clean", function() {
  return gulp.src(filenames.get("build"))
    .pipe(clean());
});

gulp.task("post-publish", function(callback) {
  runSequence("get-names", "publish-clean", callback);
});
