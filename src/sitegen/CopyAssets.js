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
      var assets = this.filterFilesByExtension(files, 'md', { invert: true });

      _.each(assets, function(file, name) {
         var src = path.join(metalsmith.source(), name),
             dest = path.join(metalsmith.destination(), name);

         this.grunt.log.debug('copy "%s" to "%s"', src, dest);
         this.grunt.file.mkdir(path.dirname(dest));
         this.grunt.file.copy(src, dest);
      }.bind(this));
      done();
   },

});
