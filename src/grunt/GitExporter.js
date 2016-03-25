/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
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
      this.grunt.log.debug('exporting workspace');
      return Q();
   },

   exportBranch: function(ref) {
      this.grunt.log.debug('exporting branch "%s" as "%s"', ref.name(), ref.shorthand());
   },

});
