/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {
      _.each(files, function(file) {
         var parent = _.last(file.parents);

         if (parent) {
            if (!_.isArray(parent.children)) {
               parent.children = [];
            }
            parent.children.push(file);
         }
      });

      _.each(files, function(file) {
         if (file.children) {
            _.sortBy(file.children, 'title');
         }
      });

      done();
   },

});
