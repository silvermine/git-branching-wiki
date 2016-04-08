/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    chokidar = require('chokidar'),
    BaseGitStep = require('./BaseGitStep');

module.exports = BaseGitStep.extend({

   _refs: [],
   _refNames: [],

   onRepoInitialized: function() {
      return this.updateReferenceList();
   },

   run: function() {
      var def = Q.defer(),
          watcher = chokidar.watch(this.getWatchDirectory());

      this.grunt.log.debug('watcher running (refs: %s)', this._refs);

      watcher.on('all', this._fileChanged.bind(this));

      // return a never-ending promise to keep watching
      return def.promise;
   },

   updateReferenceList: function() {
      return this.getReferenceList()
         .then(function(refs) {
            this._refs = refs;
            this._refNames = _.invoke(refs, 'name');
         }.bind(this));
   },

   _fileChanged: function() {
      // this.grunt.log.debug('file changed', arguments);
   },

});
