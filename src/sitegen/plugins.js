/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');

function timer(grunt, name, fn) {
   return function(files, metalsmith, done) {
      var start = _.now(),
      numFiles = Object.keys(files).length;
      return fn(files, metalsmith, function() {
         var stop = _.now();
         grunt.log.ok('Plugin [%s] took %s seconds on %s files', name, ((stop - start) / 1000), numFiles);
         done.apply(undefined, arguments);
      });
   };
}

function timedLocalPlugin(grunt, opts, name) {
   var Plugin = require('./' + name),
       plugin = new Plugin(grunt, opts);

   return timer(grunt, name, plugin.run.bind(plugin));
}

module.exports = {

   list: function(grunt, opts) {
      return [
         timedLocalPlugin(grunt, opts, 'CopyAssets'),
         timedLocalPlugin(grunt, opts, 'RejectAssets'),
         timedLocalPlugin(grunt, opts, 'FileSourceMetadata'),
         timedLocalPlugin(grunt, opts, 'SetGlobalBranchList'),
         timedLocalPlugin(grunt, opts, 'Slug'),
         // timedLocalPlugin(grunt, opts, 'Debug'),
      ];
   },

};
