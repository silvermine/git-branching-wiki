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
    PluginClass = require('../../sitegen/Markdown'),
    plugin = util.createPlugin(PluginClass);

describe('Markdown sitegen plugin', function() {

   describe('markdown rendering', function() {
      this.slow(250);

      it('produces expected output', function(done) {
         util.readFixturesAsFiles('index.md', 'SomeOtherDocPage.md')
            .then(function(files) {
               util.run(plugin, files);

               return Q.all(_.map(files, function(file, name) {
                  return Q.nfcall(fs.readFile, path.join(__dirname, 'fixtures', name))
                     .then(function(expectedMarkup) {
                        expect(file.contents.toString()).to.eql(expectedMarkup.toString());
                     });
               }));
            })
            .then(function() { done(); })
            .catch(done);
      });

   });
});
