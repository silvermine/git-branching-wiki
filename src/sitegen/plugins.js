/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');

/* istanbul ignore next */
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

/* istanbul ignore next */
function timedLocalPlugin(grunt, opts, name) {
   var Plugin = require('./' + name),
       plugin = new Plugin(grunt, opts);

   return timer(grunt, name, plugin.run.bind(plugin));
}

module.exports = {

   /* istanbul ignore next */
   list: function(grunt, opts) {
      return [
         timedLocalPlugin(grunt, opts, 'CopyAssets'),
         timedLocalPlugin(grunt, opts, 'RejectAssets'),
         timedLocalPlugin(grunt, opts, 'FileSourceMetadata'),
         timedLocalPlugin(grunt, opts, 'SetGlobalBranchList'),
         timedLocalPlugin(grunt, opts, 'Slug'),
         timedLocalPlugin(grunt, opts, 'SetFileURL'),
         timedLocalPlugin(grunt, opts, 'Markdown'),
         timedLocalPlugin(grunt, opts, 'TitleFallbacks'), // from frontmatter, then fallback to h1, then slug (relies on markdown)
         timedLocalPlugin(grunt, opts, 'HeadingsMap'), // for per-page TOC, create a headings map
         timedLocalPlugin(grunt, opts, 'ParentsList'),
         timedLocalPlugin(grunt, opts, 'ChildrenList'), // relies on titles for sorting children
         timedLocalPlugin(grunt, opts, 'Templating'),
         // timedLocalPlugin(grunt, opts, 'Debug'),
      ];
   },

};
