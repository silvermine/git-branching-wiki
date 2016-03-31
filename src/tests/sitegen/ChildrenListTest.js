/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/ChildrenList'),
    plugin = util.createPlugin(PluginClass);

describe('ChildrenList sitegen plugin', function() {
   // this array intentionally puts children into non-alpha order
   // so that we also test the order of the children
   var files = {
      'workspace/index.md': { title: 'Homepage', __parents: [] },
      'workspace/SomethingElse.md': { title: 'Something Else', __parents: [ 'workspace/index.md' ] },
      'workspace/SomethingElse2.md': { title: 'Another Page', __parents: [ 'workspace/index.md' ] },
      'workspace/Developers.md': { title: 'Dev Team', __parents: [ 'workspace/index.md' ] },
      'workspace/CodeStandards.md': { title: 'Code Standards', __parents: [ 'workspace/index.md', 'workspace/Developers.md' ] },
   };

   _.each(files, function(file, name) {
      file.__name = name;
      file.parents = _.map(file.__parents, function(parentName) {
         return files[parentName];
      });
   });

   it('basically works', function() {
      util.run(plugin, files);

      expect(_.pluck(files['workspace/index.md'].children, '__name')).to.eql([
         'workspace/SomethingElse2.md',
         'workspace/Developers.md',
         'workspace/SomethingElse.md',
      ]);

      expect(_.pluck(files['workspace/Developers.md'].children, '__name')).to.eql([
         'workspace/CodeStandards.md',
      ]);
   });
});
