/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Class = require('class.extend');

module.exports = Class.extend({

   init: function(grunt, opts) {
      this.grunt = grunt;
      this.opts = opts;
   },

   prepare: _.noop,

});
