module.exports = function (grunt) {
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  ngdoc: {
	all: ['js/*.js']
  }
});
grunt.loadNpmTasks('grunt-ngdoc');

grunt.registerTask('default', ['ngdoc']);
};