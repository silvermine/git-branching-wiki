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
    PluginClass = require('../../sitegen/SetFileURL'),
    plugin = util.createPlugin(PluginClass);

function createSampleFiles(expectations) {
   return _.reduce(expectations, function(memo, url, name) {
      memo[name] = { expectedURL: url, sourceInfo: { paths: { full: name } } };
      return memo;
   }, {});
}

describe('SetFileURL sitegen plugin', function() {
   it('basically works', function() {
      var files = createSampleFiles({
         'workspace/index.md': 'workspace/index.html',
         'workspace/folder/SomeDocumentationPage.md': 'workspace/folder/SomeDocumentationPage.html',
         'remote-branches/origin/master/folder/SomeDocumentationPage.md': 'remote-branches/origin/master/folder/SomeDocumentationPage.html',
         'workspace/folder/Some@Doc-Page.With.Weird.Names012.md': 'workspace/folder/SomeDoc-Page.With.Weird.Names012.html',
      });

      util.run(plugin, files);

      _.each(files, function(file) {
         expect(file.url).to.eql(file.expectedURL);
      });
   });
});
