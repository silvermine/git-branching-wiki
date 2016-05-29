/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    cheerio = require('cheerio'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {
      _.each(files, function(file) {
         var contents, $, h1;

         if (file.title) {
            // the title was explicitly set in the frontmatter
            return;
         }

         contents = file.contents.toString();
         $ = cheerio.load(contents);
         h1 = $('h1').first().text();

         file.title = (h1 || this.formatSlug(file.slug)).trim();
      }.bind(this));

      done();
   },

   formatSlug: function(slug) {
      return slug.replace(/([A-Z])/g, ' $1');
   },

});
