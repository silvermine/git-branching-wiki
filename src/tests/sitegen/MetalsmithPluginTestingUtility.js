/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('yaml-front-matter'),
    Class = require('class.extend'),
    Task = require('../../../tasks/index'),
    MockMetalsmith,
    DEFAULT_OPTS = Task.DEFAULT_OPTS;

MockMetalsmith = Class.extend({
   _metadata: {},

   metadata: function(data) {
      if (data) {
         this._metadata = data;
      }

      return this._metadata;
   },

});

module.exports = Class.extend({

   createPlugin: function(Class) {
      return new Class(this.mockGrunt(), this.getOptions());
   },

   run: function(plugin, files) {
      plugin.run(files, this.mockMetalsmith(), _.noop);
   },

   readFixturePage: function(filename) {
      var filePath = path.join(__dirname, 'fixtures', filename);

      return Q.nfcall(fs.readFile, filePath)
         .then(yaml.loadFront.bind(yaml))
         .then(function(results) {
            var file = _.omit(results, '__content');

            file.contents = new Buffer(results.__content);
            file.__name = filename;
            return file;
         });
   },

   readFixturesAsFiles: function() {
      return Q.all(_.map(_.first(arguments, arguments.length), this.readFixturePage.bind(this)))
         .then(function(list) {
            return _.reduce(list, function(memo, file) {
               memo[file.__name] = _.omit(file, '__name');
               return memo;
            }, {});
         });
   },

   mockGrunt: function() {
      return {};
   },

   mockMetalsmith: function() {
      return new MockMetalsmith();
   },

   getOptions: function() {
      return DEFAULT_OPTS;
   },

});
