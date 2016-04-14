var gulp = require("gulp");
var webpack = require("gulp-webpack");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var filenames = require("gulp-filenames");
var print = require("gulp-print");
var filter = require("gulp-filter");
var gulpTypings = require("gulp-typings");
var git = require("gulp-git");
var fs = require("fs");
 
// Install typings.
gulp.task("typings",function(){
  return ! fs.existsSync("./typings") ?
    gulp.src("./typings.json")
      .pipe(gulpTypings()) : null;
});

// Build TypeScript.
gulp.task("webpack", function(callback) {
  var build = gulp.src("modules/*")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("build/"));

  return build;
});

gulp.task("movedts", function(callback) {
  var move = gulp.src("build/modules/*")
    .pipe(gulp.dest("build/"));

  return move;
});

gulp.task("tsbuild", function(callback) {
  return runSequence("webpack", "movedts", callback);
});

gulp.task("lint", function() {
  var tslint = require("gulp-tslint");
  return gulp.src(["modules/*.ts"])
      .pipe(tslint({
        tslint: require("tslint").default,
        configuration: require("./tslint.json")
      }))
      .pipe(tslint.report("prose", {emitError: true}));
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
  runSequence("typings", "lint", "tsbuild", "build-clean", "git-add", callback);
});
