/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {
      var branches;

      branches = _.reduce(files, function(memo, file) {
         var branch = file.sourceInfo.branchShorthand;
         if (!memo[branch]) {
            memo[branch] = _.omit(file.sourceInfo, 'paths');
         }
         return memo;
      }, {});

      metalsmith.metadata(_.extend(metalsmith.metadata(), { branches: branches }));

      done();
   },

});
