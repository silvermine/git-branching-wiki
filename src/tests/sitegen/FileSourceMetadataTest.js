/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/FileSourceMetadata'),
    plugin = util.createPlugin(PluginClass),
    DEFAULT = plugin.defaultParsedInfo(),
    createTestCases;

describe('FileSourceMetadata sitegen plugin', function() {

   describe('defaultParsedInfo', function() {
      it('does not allow defaults to be overwritten', function() {
         var before = JSON.parse(JSON.stringify(plugin.defaultParsedInfo())),
             defaults = plugin.defaultParsedInfo();

         defaults.isWorkspace = true;
         defaults.paths = {
            full: 'test',
         };

         expect(defaults).to.not.eql(before);
      });
   });

   describe('parseInfoFromPath', function() {
      it('basically works', function() {
         _.each(createTestCases(), function(expectedInfo, name) {
            expect(plugin.parseInfoFromPath(name)).to.eql(_.extend({}, DEFAULT, expectedInfo));
         });
      });
   });

   it('basically works', function() {
      var tests = createTestCases(),
          files = {};

      _.each(tests, function(expectedInfo, name) {
         files[name] = {};
      });

      util.run(plugin, files);

      _.each(files, function(file, name) {
         expect(file.sourceInfo).to.eql(_.extend({}, DEFAULT, tests[name]));
      });
   });
});

createTestCases = function() {
   var tests = {};

   tests['workspace/index.md'] = {
      isWorkspace: true,
      branchShorthand: 'workspace',
      paths: {
         docBaseRelative: 'index.md',
         typeDir: 'workspace',
      }
   };

   tests['remote-branches/origin/master/index.md'] = {
      isBranch: true,
      isRemote: true,
      paths: {
         docBaseRelative: 'index.md',
         typeDir: 'remote-branches',
         remoteName: 'origin',
         branchName: 'master',
      },
      branchShorthand: 'origin/master',
   };

   tests['local-branches/master/index.md'] = {
      isBranch: true,
      isLocal: true,
      paths: {
         docBaseRelative: 'index.md',
         typeDir: 'local-branches',
         branchName: 'master',
      },
      branchShorthand: 'master',
   };

   tests['tags/some-tag/index.md'] = {
      isTag: true,
      paths: {
         docBaseRelative: 'index.md',
         typeDir: 'tags',
         tagName: 'some-tag',
      },
   };

   // same tests, but now with subdirectories
   tests['workspace/some/folders/a/b/c/index.md'] = {
      isWorkspace: true,
      branchShorthand: 'workspace',
      paths: {
         docBaseRelative: 'some/folders/a/b/c/index.md',
         typeDir: 'workspace',
      }
   };

   tests['remote-branches/origin/master/some/folders/a/b/c/index.md'] = {
      isBranch: true,
      isRemote: true,
      paths: {
         docBaseRelative: 'some/folders/a/b/c/index.md',
         typeDir: 'remote-branches',
         remoteName: 'origin',
         branchName: 'master',
      },
      branchShorthand: 'origin/master',
   };

   tests['local-branches/master/some/folders/a/b/c/index.md'] = {
      isBranch: true,
      isLocal: true,
      paths: {
         docBaseRelative: 'some/folders/a/b/c/index.md',
         typeDir: 'local-branches',
         branchName: 'master',
      },
      branchShorthand: 'master',
   };

   tests['tags/some-tag/some/folders/a/b/c/index.md'] = {
      isTag: true,
      paths: {
         docBaseRelative: 'some/folders/a/b/c/index.md',
         typeDir: 'tags',
         tagName: 'some-tag',
      },
   };

   _.each(tests, function(info, name) {
      info.paths.full = name;
   });

   return tests;
};
