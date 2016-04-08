/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';
/* globals describe, it */

var _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/HeadingsMap'),
    plugin = util.createPlugin(PluginClass);

describe('HeadingsMap sitegen plugin', function() {
   it('basically works', function(done) {
      var loadFiles;

      loadFiles = _.map([ 'index.html', 'SomeOtherDocPage.html', 'WeirdHeadingsPage.html' ], function(filename) {
         return Q.nfcall(fs.readFile, path.join(__dirname, 'fixtures', filename))
            .then(function(markup) {
               return [ filename, markup ];
            });
      });

      Q.all(loadFiles)
         .then(function(loadedFiles) {
            return _.chain(loadedFiles)
               .object()
               .mapObject(function(contents) {
                  return { contents: contents };
               })
               .value();
         })
         .then(function(files) {
            util.run(plugin, files);

            expect(files['index.html'].headings).to.eql([
               { id: 'welcome-to-documentation', text: 'Welcome to Documentation', weight: 1, subheadings: [
                  { id: 'second-level-subheading', text: 'Second-Level Subheading', weight: 2, subheadings: [
                     { id: 'third-level-subheading', text: 'Third-Level Subheading', weight: 3, subheadings: [] },
                  ]},
               ]},
            ]);

            expect(files['SomeOtherDocPage.html'].headings).to.eql([
               { id: 'another-page-of-docs', text: 'Another Page of Docs', weight: 1, subheadings: [
                  { id: 'lots-of-markdown-things', text: 'Lots of Markdown Things', weight: 2, subheadings: [
                     { id: 'code-links', text: 'Code links', weight: 3, subheadings: [] },
                  ]},
               ]},
            ]);

            // H1 below H2, etc
            expect(files['WeirdHeadingsPage.html'].headings).to.eql([
               { id: 'subheading-level-1', text: 'Subheading Level 1', weight: 1, subheadings: [
                  { id: 'subheading-level-2', text: 'Subheading Level 2', weight: 2, subheadings: [
                     { id: 'subheading-level-3', text: 'Subheading Level 3', weight: 3, subheadings: [
                     ]},
                  ]},
                  { id: 'subheading-level-2-2', text: 'Subheading Level 2 2', weight: 2, subheadings: []},
               ]},
               { id: 'subheading-level-1-2', text: 'Subheading Level 1 2', weight: 1, subheadings: [
                  { id: 'subheading-level-2-3', text: 'Subheading Level 2 3', weight: 2, subheadings: [
                     { id: 'subheading-level-3-2', text: 'Subheading Level 3 2', weight: 3, subheadings: []},
                  ]},
               ]},
            ]);

            done();
         })
         .catch(done);
   });
});
