/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/SetGlobalBranchList'),
    plugin = util.createPlugin(PluginClass),
    parser = util.createPlugin(require('../../sitegen/FileSourceMetadata')),
    DEFAULT = parser.defaultParsedInfo();

describe('SetGlobalBranchList sitegen plugin', function() {
   it('basically works', function() {
      var files, runResults, expectations;

      files = {
         'workspace/index.md': { },
         'workspace/SomeDocumentationPage.md': { },
         'workspace/folder/SomeDocumentationPage.md': { },
         'local-branches/master/folder/SomeDocumentationPage.md': { },
         'remote-branches/origin/master/folder/SomeDocumentationPage.md': { },
      };

      expectations = [
         {
            isWorkspace: true,
            branchShorthand: 'workspace',
         },
         {
            isBranch: true,
            isLocal: true,
            branchShorthand: 'master',
         },
         {
            isBranch: true,
            isRemote: true,
            branchShorthand: 'origin/master',
         },
      ];

      expectations = _.reduce(expectations, function(memo, exp) {
         memo[exp.branchShorthand] = _.extend({}, DEFAULT, exp);
         return memo;
      }, {});

      // use this to set up the correct info on the files:
      util.run(parser, files);

      // now run the plugin that we're testing
      runResults = util.run(plugin, files);

      console.log(runResults.metalsmith.metadata());
      expect(runResults.metalsmith.metadata()).to.eql({ branches: expectations });
   });
});
