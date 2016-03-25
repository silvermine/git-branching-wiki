/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    git = require('nodegit'),
    path = require('path'),
    BaseStep = require('./BaseStep');

module.exports = BaseStep.extend({

   prepare: function() {
      var dir = this.getRepoDirectory();

      this.grunt.log.debug('opening repo at "%s"', dir);

      return git.Repository.open(dir)
         .then(function(repo) {
            this.grunt.log.debug('repo opened from "%s"', dir);
            this.repo = repo;
            return this.onRepoInitialized();
         }.bind(this));
   },

   getRepoDirectory: function() {
      return path.resolve(this.opts.input.base);
   },

   getWatchDirectory: function() {
      return path.resolve(this.opts.input.git);
   },

   onRepoInitialized: _.noop,

   convertReferenceNamesToObjects: function(names) {
      return Q.all(_.map(names, function(refName) {
         return git.Reference.lookup(this.repo, refName);
      }.bind(this)));
   },

   getReferenceList: function() {
      return git.Reference.list(this.repo).then(this.convertReferenceNamesToObjects.bind(this));
   },

});
