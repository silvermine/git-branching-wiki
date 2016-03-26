/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    path = require('path'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {

      _.each(files, function(file, name) {
         file.slug = path.basename(name).replace(/\.([\w\d]+)$/, '');
      }.bind(this));

      done();
   },

});
