/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/CopyAssets'),
    plugin = util.createPlugin(PluginClass);

describe('CopyAssets sitegen plugin', function() {
   it('basically works', function() {
      var files = {
         'workspace/test.jpg': {},
         'workspace/something.css': {},
         'workspace/index.md': {},
         'workspace/SomeDocumentationPage.md': {},
      };

      // TODO: implement this test, which will involve mocking grunt (and maybe metalsmith)
      // util.run(plugin, files);
      // then test that the jpg and css file were copied, and the md files were not
      // also test that mkdir was called with the proper input
   });
});
