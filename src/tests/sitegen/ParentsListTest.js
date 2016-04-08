/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';
/* globals describe, it */

var _ = require('underscore'),
    path = require('path'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/ParentsList'),
    plugin = util.createPlugin(PluginClass),
    addSampleFile, getSampleFiles;

function testFilesAgainstExpectations(file) {
   expect(_.pluck(file.parents, '__name')).to.eql(file.__expectedParents);
}

describe('ParentsList sitegen plugin', function() {

   it('basically works', function() {
      var files = getSampleFiles(),
          names = _.keys(files);

      util.run(plugin, files);

      expect(_.keys(files)).to.eql(names);
      _.each(files, testFilesAgainstExpectations);
   });

   it('works when the parent is a non-existent file', function() {
      var files = getSampleFiles();

      addSampleFile(files, 'workspace/SomeFile.md', 'workspace', [ 'workspace/index.md' ], 'NonExistentPage');
      util.run(plugin, files);
      _.each(files, testFilesAgainstExpectations);
   });

});

addSampleFile = function(files, name, branchShorthand, expectedParents, parentSlug) {
   files[name] = {
      __name: name,
      __expectedParents: expectedParents,

      sourceInfo: { branchShorthand: branchShorthand },
      slug: path.basename(name).replace(/\.md$/, ''),
      parent: parentSlug,
   };
};

getSampleFiles = function() {
   var files = {};

   // root file in your workspace
   addSampleFile(
      files,
      'workspace/index.md',
      'workspace',
      []
   );
   // a file that sets no parent, but should be child of root
   addSampleFile(
      files,
      'workspace/Developers.md',
      'workspace',
      [ 'workspace/index.md' ]
   );
   // a file that sets a parent and is grandchild of root
   addSampleFile(
      files,
      'workspace/dev-team/DevelopersCodingStandards.md',
      'workspace',
      [ 'workspace/index.md', 'workspace/Developers.md' ],
      'Developers'
   );
   // a file that sets a parent and is great-grandchild of root
   addSampleFile(
      files,
      'workspace/dev-team/a/b/StandardsJS.md',
      'workspace',
      [ 'workspace/index.md', 'workspace/Developers.md', 'workspace/dev-team/DevelopersCodingStandards.md' ],
      'DevelopersCodingStandards'
   );

   // all the same tests, but with a local branch:
   // root file in your workspace
   addSampleFile(
      files,
      'local-branches/master/index.md',
      'master',
      []
   );
   // a file that sets no parent, but should be child of root
   addSampleFile(
      files,
      'local-branches/master/Developers.md',
      'master',
      [ 'local-branches/master/index.md' ]
   );
   // a file that sets a parent and is grandchild of root
   addSampleFile(
      files,
      'local-branches/master/dev-team/DevelopersCodingStandards.md',
      'master',
      [ 'local-branches/master/index.md', 'local-branches/master/Developers.md' ],
      'Developers'
   );
   // a file that sets a parent and is great-grandchild of root
   addSampleFile(
      files,
      'local-branches/master/dev-team/a/b/StandardsJS.md',
      'master',
      [ 'local-branches/master/index.md', 'local-branches/master/Developers.md', 'local-branches/master/dev-team/DevelopersCodingStandards.md' ],
      'DevelopersCodingStandards'
   );

   // all the same tests, but with a remote branch:
   // root file in your workspace
   addSampleFile(
      files,
      'remotes/origin/master/index.md',
      'origin/master',
      []
   );
   // a file that sets no parent, but should be child of root
   addSampleFile(
      files,
      'remotes/origin/master/Developers.md',
      'origin/master',
      [ 'remotes/origin/master/index.md' ]
   );
   // a file that sets a parent and is grandchild of root
   addSampleFile(
      files,
      'remotes/origin/master/dev-team/DevelopersCodingStandards.md',
      'origin/master',
      [ 'remotes/origin/master/index.md', 'remotes/origin/master/Developers.md' ],
      'Developers'
   );
   // a file that sets a parent and is great-grandchild of root
   addSampleFile(
      files,
      'remotes/origin/master/dev-team/a/b/StandardsJS.md',
      'origin/master',
      [ 'remotes/origin/master/index.md', 'remotes/origin/master/Developers.md', 'remotes/origin/master/dev-team/DevelopersCodingStandards.md' ],
      'DevelopersCodingStandards'
   );

   return files;
};
