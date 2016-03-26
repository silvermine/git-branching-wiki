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
         var filename;

         filename = path.basename(file.sourceInfo.paths.full)
            .replace(/[^\w\d\-\.]/g, '')
            .replace(/\.md$/, '.html');

         file.url = _.flatten([
            path.dirname(file.sourceInfo.paths.full).split(path.sep),
            filename
         ]).join('/');
      }.bind(this));

      done();
   },

});
