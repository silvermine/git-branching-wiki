/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    copy = require('recursive-copy'),
    mkdir = Q.nfbind(require('mkdirp')),
    git = require('nodegit'),
    path = require('path'),
    BaseGitStep = require('./BaseGitStep');

module.exports = BaseGitStep.extend({

   run: function() {
      var self = this;

      return this.exportWorkspace()
         .then(this.getReferenceList.bind(this))
         .then(function(refs) {
            return _.reduce(refs, function(prev, ref) {
               // TODO: this will need to filter down to just those things that are actually branches:
               return prev.then(self.exportBranch.bind(self, ref));
            }, Q());
         });
   },

   exportWorkspace: function() {
      var srcDir = path.join(this.getRepoDirectory(), this.opts.input.docs),
          destDir = path.join(this.getOutputRawDirectory(), this.opts.output.workspaceDir);

      this.grunt.log.debug('exporting workspace "%s" to "%s"', srcDir, destDir);
      // TODO: find a more efficient copy mechanism that just syncs changed files, for instance
      // it should also delete files that no longer exist in the workspace
      return copy(srcDir, destDir, { overwrite: true })
         .then(function(results) {
            this.grunt.log.ok('copied %d files from "%s" to "%s"', results.length, srcDir, destDir);
         }.bind(this));
   },

   exportBranch: function(ref) {
      var destDir = path.join(this.getOutputRawDirectory(), this.getRelativePathForRef(ref));

      this.grunt.log.debug('exporting branch "%s" to "%s"', ref.name(), destDir);

      return mkdir(destDir)
         .then(function() {
            // TODO: not sure why I'm having to lookup the commit since the checkout should take
            // the reference by itself, but without this lookup I was getting an error that said:
            // "Object to checkout does not match repository"
            return git.Commit.lookup(this.repo, ref.target().tostrS());
         }.bind(this))
         .then(function(commit) {
            var opts = {
               targetDirectory: destDir,
               checkoutStrategy: git.Checkout.STRATEGY.FORCE,
               paths: this.opts.input.docs,
            };

            return git.Checkout.tree(this.repo, commit, opts);
         }.bind(this));
   },

   getRelativePathForRef: function(ref) {
      var branchTypeDir = (ref.isRemote() ? this.opts.output.remoteBranchesDir : this.opts.output.localBranchesDir);

      return path.join(branchTypeDir, ref.shorthand());
   },

});
