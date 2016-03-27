/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/RejectAssets'),
    plugin = util.createPlugin(PluginClass);

describe('RejectAssets sitegen plugin', function() {
   it('basically works', function() {
      var files, expected;

      files = {
         'workspace/test.jpg': {},
         'workspace/index.md': {},
         'workspace/index.css': {},
         'workspace/SomeDocumentationPage.md': {},
      };

      expected = [
         'workspace/index.md',
         'workspace/SomeDocumentationPage.md',
      ];

      util.run(plugin, files);

      expect(_.keys(files)).to.eql(expected);
   });
});
