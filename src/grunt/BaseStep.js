/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    path = require('path'),
    Class = require('class.extend');

module.exports = Class.extend({

   init: function(grunt, opts) {
      this.grunt = grunt;
      this.opts = opts;
   },

   prepare: _.noop,

   getOutputBaseDirectory: function() {
      return path.resolve(this.opts.output.base);
   },

   getOutputRawDirectory: function() {
      return path.join(this.getOutputBaseDirectory(), this.opts.output.raw);
   },

   getOutputSiteDirectory: function() {
      return path.join(this.getOutputBaseDirectory(), this.opts.output.site);
   },

});
