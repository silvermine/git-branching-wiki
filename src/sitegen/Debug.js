/**
 * This class is useful for development, but not needed for runtime. You can
 * insert it into the plugin list in plugins.js and get a dump of global
 * metadata, files, etc.
 *
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {
      this.grunt.log.debug('global metalsmith metadata:', metalsmith.metadata());

      _.each(files, function(file, name) {
         this.grunt.log.debug('file "%s":', name, file);
      }.bind(this));

      done();
   },

});
