/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';
/* globals describe, it */

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/Slug'),
    plugin = util.createPlugin(PluginClass);

describe('Slug sitegen plugin', function() {
   it('basically works', function() {
      var files = {
         'workspace/index.md': { expectedSlug: 'index' },
         'workspace/SomeDocumentationPage.md': { expectedSlug: 'SomeDocumentationPage' },
         'workspace/folder/SomeDocumentationPage.md': { expectedSlug: 'SomeDocumentationPage' },
         'remote-branches/origin/master/folder/SomeDocumentationPage.md': { expectedSlug: 'SomeDocumentationPage' },
      };

      util.run(plugin, files);

      _.each(files, function(file) {
         expect(file.slug).to.eql(file.expectedSlug);
      });
   });
});
