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
    PluginClass = require('../../sitegen/BasePlugin'),
    plugin = util.createPlugin(PluginClass);

describe('Base sitegen plugin', function() {

   describe('filterFilesByExtension', function() {
      var samples = {
         'workspace/test.jpg': {},
         'workspace/index.md': {},
         'workspace/index.html': {},
         'workspace/SomeDocumentationPage.md': {},
      };

      function expectFileList(results, expectedIndices) {
         var names = _.keys(samples),
             expected;

         expected = _.reduce(expectedIndices, function(memo, index) {
            memo.push(names[index]);
            return memo;
         }, []);

         expect(_.keys(results)).to.eql(expected);
      }

      it('works with a single extension and default options', function() {
         expectFileList(
            plugin.filterFilesByExtension(samples, 'jpg'),
            [ 0 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, 'md'),
            [ 1, 3 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, 'html'),
            [ 2 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, 'jpeg'),
            []
         );
      });

      it('works with array of extensions and default options', function() {
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'jpg', 'md' ]),
            [ 0, 1, 3 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'html', 'md' ]),
            [ 1, 2, 3 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'html' ]),
            [ 2 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'jpeg', 'html' ]),
            [ 2 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'jpeg', 'html', 'jpg' ]),
            [ 0, 2 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'jpeg' ]),
            []
         );
      });

      it('works in inverted mode', function() {
         expectFileList(
            plugin.filterFilesByExtension(samples, 'jpg', { invert: true }),
            [ 1, 2, 3 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, 'md', { invert: true }),
            [ 0, 2 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, [ 'md', 'html' ], { invert: true }),
            [ 0 ]
         );
         expectFileList(
            plugin.filterFilesByExtension(samples, 'jpeg', { invert: true }),
            [ 0, 1, 2, 3 ]
         );
      });

      it('does not modify the input array in default mode', function() {
         var original = _.extend({}, samples);

         expectFileList(
            plugin.filterFilesByExtension(samples, 'jpg', { invert: true }),
            [ 1, 2, 3 ]
         );
         expect(_.keys(samples)).to.eql(_.keys(original));
      });

      it('modifies the input array when told to do so', function() {
         var input, result;

         // test with single extension input:
         input = _.extend({}, samples);
         result = plugin.filterFilesByExtension(input, 'jpg', { inplace: true });
         // this expectation tests that the *returned* list is correct
         expectFileList(result, [ 0 ]);
         // this expectation tests that the *input* list was modified and correct
         expectFileList(input, [ 0 ]);

         // test with array extension input:
         input = _.extend({}, samples);
         result = plugin.filterFilesByExtension(input, [ 'html', 'jpg' ], { inplace: true });
         // this expectation tests that the *returned* list is correct
         expectFileList(result, [ 0, 2 ]);
         // this expectation tests that the *input* list was modified and correct
         expectFileList(input, [ 0, 2 ]);

         // test with single extension input, and inverted:
         input = _.extend({}, samples);
         result = plugin.filterFilesByExtension(input, 'md', { invert: true, inplace: true });
         // this expectation tests that the *returned* list is correct
         expectFileList(result, [ 0, 2 ]);
         // this expectation tests that the *input* list was modified and correct
         expectFileList(input, [ 0, 2 ]);

         // test with array extension input, and inverted:
         input = _.extend({}, samples);
         result = plugin.filterFilesByExtension(input, [ 'html', 'jpg' ], { invert: true, inplace: true });
         // this expectation tests that the *returned* list is correct
         expectFileList(result, [ 1, 3 ]);
         // this expectation tests that the *input* list was modified and correct
         expectFileList(input, [ 1, 3 ]);
      });
   });

});
