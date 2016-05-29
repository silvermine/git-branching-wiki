/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    BasePlugin = require('./BasePlugin');

function createVirtualID(file, slugOverride) {
   return file.sourceInfo.branchShorthand + '/' + (slugOverride || file.slug);
}

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {
      var filesByVirtualID;

      filesByVirtualID = _.indexBy(files, function(file) {
         return createVirtualID(file);
      });

      _.each(files, function(file) {
         file.parents = this.buildParentsList(filesByVirtualID, file);

         // if this file is not the root page, and it has no parents or the top-level parent
         // is not the root page, then force the root page as its first parent
         if (file.slug !== 'index' && (_.isEmpty(file.parents) || _.first(file.parents).slug !== 'index')) {
            file.parents.unshift(filesByVirtualID[createVirtualID(file, 'index')]);
         }

         // in case our pushing of the index resulted in a null parent,
         // or in case parent references a non-existent parent, or in some
         // other way we end up with a falsy parent in our list:
         file.parents = _.filter(file.parents, _.identity);
      }.bind(this));

      done();
   },

   buildParentsList: function(filesByVirtualID, file, list) {
      var parent;

      list = (list || []);

      if (!file.parent) {
         return list;
      }

      parent = filesByVirtualID[createVirtualID(file, file.parent)];

      if (!parent) {
         return list;
      }

      list.unshift(parent);
      return this.buildParentsList(filesByVirtualID, parent, list);
   },

});
