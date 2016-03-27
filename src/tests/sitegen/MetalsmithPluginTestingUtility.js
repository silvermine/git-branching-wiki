/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
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
