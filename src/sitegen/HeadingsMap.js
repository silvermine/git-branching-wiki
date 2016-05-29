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
         var contents = file.contents.toString(),
             $ = cheerio.load(contents),
             headings = [],
             stack = [];

         $('h1, h2, h3, h4, h5, h6').each(function() {
            var elem = $(this);

            headings.push({
               id: elem.attr('id'),
               text: elem.text(),
               weight: parseInt(elem.get(0).tagName.replace('h', ''), 10),
               subheadings: [],
            });
         });

         file.headings = _.reduce(headings, function(list, heading) {
            var parentWeight;

            parentWeight = _.findLastIndex(stack, function(h) {
               return h && h.weight < heading.weight;
            });

            if (parentWeight === -1) {
               list.push(heading);
            } else {
               stack[parentWeight].subheadings.push(heading);
            }

            _.each(stack, function(h) {
               if (h && h.weight >= heading.weight) {
                  delete stack[h.weight];
               }
            });

            stack[heading.weight] = heading;
            return list;
         }, []);
      });

      done();
   },

});
