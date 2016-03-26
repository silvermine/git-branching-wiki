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
         file.sourceInfo = this.parseInfoFromPath(name);
      }.bind(this));

      done();
   },

   parseInfoFromPath: function(filePath) {
      var parts = filePath.split(path.sep),
          refType = parts.shift(),
          info;

      info = {
         isWorkspace: false,
         isBranch: false,
         isTag: false,
         isLocal: false,
         isRemote: false,
      };

      if (refType == this.opts.output.workspaceDir) {
         info.isWorkspace = true;
      } else if (refType == this.opts.output.remoteBranchesDir) {
         info.isBranch = true;
         info.isRemote = true;
      } else if (refType == this.opts.output.localBranchesDir) {
         info.isBranch = true;
         info.isLocal = true;
      } else if (refType == this.opts.output.tagsDir) {
         info.isTag = true;
      }

      return info;
   },

});
