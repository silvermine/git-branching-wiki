/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    marked = require('marked'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   transformRawMarkdown: function(str) {
      return str;
   },

   run: function(files, metalsmith, done) {

      _.each(files, function(file, name) {
         var str = file.contents.toString();

         str = this.transformRawMarkdown(str);
         str = marked(str, {
            smartypants: true,
            gfm: true,
            breaks: true,
            tables: true,
            // TODO: add custom renderer
            // TODO: add code highlighting
         });

         file.contents = new Buffer(str);
         delete files[name];
         files[file.url] = file;
      }.bind(this));

      done();
   },

});
