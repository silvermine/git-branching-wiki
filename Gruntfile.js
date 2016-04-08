/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

   var config;

   config = {
      js: {
         all: [ 'Gruntfile.js', 'src/**/*.js', 'tasks/**/*.js' ],
      },
   };

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      jshint: {
         options: {
            jshintrc: true,
         },
         all: config.js.all,
      },

      jscs: {
         src: config.js.all,
      },
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-jscs');

   grunt.registerTask('default', [ 'jshint', 'jscs' ]);

};

