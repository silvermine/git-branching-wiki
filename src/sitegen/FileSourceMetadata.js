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
         paths: {
            full: filePath,
            typeDir: refType,
         },
      };

      if (refType == this.opts.output.workspaceDir) {
         info.isWorkspace = true;
         info.branchShorthand = refType;
      } else if (refType == this.opts.output.remoteBranchesDir) {
         info.isBranch = true;
         info.isRemote = true;
         info.paths.remoteName = parts.shift();
         info.paths.branchName = parts.shift();
         info.branchShorthand = info.paths.remoteName + '/' + info.paths.branchName;
      } else if (refType == this.opts.output.localBranchesDir) {
         info.isBranch = true;
         info.isLocal = true;
         info.paths.branchName = parts.shift();
         info.branchShorthand = info.paths.branchName;
      } else if (refType == this.opts.output.tagsDir) {
         info.isTag = true;
         info.paths.tagName = parts.shift();
      }

      info.paths.docBaseRelative = parts.join(path.sep);

      return info;
   },

});
