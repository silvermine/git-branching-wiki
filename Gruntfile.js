/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      jshint: {
         options: {
            jshintrc: true,
            ignores: [ 'src/thirdparty/**/*' ],
         },
         all: [ 'Gruntfile.js', 'src/**/*.js', 'tasks/**/*.js' ],
      },
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');

   grunt.registerTask('default', [ 'jshint' ]);

};

