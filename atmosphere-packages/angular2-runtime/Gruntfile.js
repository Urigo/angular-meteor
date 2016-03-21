module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webpack: {
      angular2_bundle: {
        entry: './angular2_deps.js',
        output: {
          filename: './dist/angular2_deps.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['npm-install',
    'webpack:angular2_bundle']);
};
