/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    copy = require('recursive-copy'),
    git = require('nodegit'),
    path = require('path'),
    BaseGitStep = require('./BaseGitStep');

module.exports = BaseGitStep.extend({

   run: function() {
      var self = this;

      return this.exportWorkspace()
         .then(this.getReferenceList.bind(this))
         .then(function(refs) {
            return Q.all(_.map(refs, function(ref) {
               // TODO: this will need to filter down to just those things that are actually branches:
               return self.exportBranch(ref);
            }));
         });
   },

   exportWorkspace: function() {
      var srcDir = path.join(this.getRepoDirectory(), this.opts.input.docs),
          destDir = this.getOutputRawDirectory();

      this.grunt.log.debug('exporting workspace "%s" to "%s"', srcDir, destDir);
      // TODO: find a more efficient copy mechanism that just syncs changed files, for instance
      // it should also delete files that no longer exist in the workspace
      return copy(srcDir, destDir, { overwrite: true })
         .then(function(results) {
            this.grunt.log.ok('copied %d files from "%s" to "%s"', results.length, srcDir, destDir);
         }.bind(this));
   },

   exportBranch: function(ref) {
      this.grunt.log.debug('exporting branch "%s" as "%s"', ref.name(), ref.shorthand());
   },

});
