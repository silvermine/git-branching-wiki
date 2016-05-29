/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/TitleFallbacks'),
    plugin = util.createPlugin(PluginClass);

describe('TitleFallbacks sitegen plugin', function() {
   it('basically works', function() {
      var files = {};

      files['workspace/index.md'] = {
         title: 'this is my user-defined YAML frontmatter title',
         contents: new Buffer('Some markup, and an <h1>HTML Title</h1> in this one'),
         slug: 'index',
         expectedTitle: 'this is my user-defined YAML frontmatter title',
      };

      files['workspace/SomeDocumentationPage.md'] = {
         // NOTE: spaces intentionally entered around the HTML title
         contents: new Buffer('Some markup, and an <h1> HTML Title </h1> in this one'),
         slug: 'SomeDocumentationPage',
         expectedTitle: 'HTML Title',
      };

      files['workspace/SomeOtherDocumentationPage.md'] = {
         contents: new Buffer('Some markup, and no h1 title in this one'),
         slug: 'SomeOtherDocumentationPage',
         expectedTitle: 'Some Other Documentation Page',
      };

      util.run(plugin, files);

      _.each(files, function(file) {
         expect(file.title).to.eql(file.expectedTitle);
      });
   });
});
