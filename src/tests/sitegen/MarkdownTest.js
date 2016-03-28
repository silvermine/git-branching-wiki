/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

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

   describe('raw markdown transformation - individual pieces', function() {

      it('transforms hash-only commit links', function() {
         var input = 'Mention commit:deadbeef in a sentence.',
             expected = 'Mention [deadbeef](https://github.com/silvermine/git-branching-wiki/commit/deadbeef) in a sentence.';

         expect(plugin.transformCommitLinks(input)).to.eql(expected);
      });

      it('transforms cross-repo commit links', function() {
         var input = 'Mention anotherorg:anotherproject:deadbeef in a sentence.',
             expected = 'Mention [anotherorg:anotherproject:deadbeef](https://github.com/anotherorg/anotherproject/commit/deadbeef) in a sentence.';

         expect(plugin.transformCommitLinks(input)).to.eql(expected);
      });

      it('transforms thumbnail macros', function() {
         var input = 'Embed a {{ thumbnail(some-big-image.png, size=400) }} here.',
             expected = 'Embed a <a class="thumbnail" href="some-big-image.png"><img width="400" src="some-big-image.png" /></a> here.';

         expect(plugin.transformThumbnailMacros(input)).to.eql(expected);
      });

      it('transforms code links', function() {
         // source:$filepath - link to a file in the repo
         expect(plugin.transformCodeLinks('test source:some/file.txt test'))
            .to.eql('test [some/file.txt](https://github.com/silvermine/git-branching-wiki/blob/master/some/file.txt) test');

         // source:$filepath@$revision - link to a file in the repo at a specific branch (e.g. master) or revision (e.g. deadbeef)
         expect(plugin.transformCodeLinks('test source:some/file.txt@deadbeef test'))
            .to.eql('test [some/file.txt@deadbeef](https://github.com/silvermine/git-branching-wiki/blob/deadbeef/some/file.txt) test');

         // source:$filepath#L120 - link to line 120 of a file
         expect(plugin.transformCodeLinks('test source:some/file.txt#L120 test'))
            .to.eql('test [some/file.txt#L120](https://github.com/silvermine/git-branching-wiki/blob/master/some/file.txt#L120) test');

         // source:$filepath#L120-125 - link to lines 120-125 of a file
         expect(plugin.transformCodeLinks('test source:some/file.txt#L120-125 test'))
            .to.eql('test [some/file.txt#L120-125](https://github.com/silvermine/git-branching-wiki/blob/master/some/file.txt#L120-L125) test');

         // source:$filepath@$revision#L120-125 - link to lines 120-125 of a file at a specific revision
         expect(plugin.transformCodeLinks('test source:some/file.txt@deadbeef#L120-125 test'))
            .to.eql('test [some/file.txt@deadbeef#L120-125](https://github.com/silvermine/git-branching-wiki/blob/deadbeef/some/file.txt#L120-L125) test');

         // source:$group:$repo|$filepath@$revision#L120-125 - link to a file in another repo
         expect(plugin.transformCodeLinks('test source:anotherorg:anotherproject|some/file.txt@deadbeef#L120-125 test'))
            .to.eql('test [anotherorg:anotherproject|some/file.txt@deadbeef#L120-125](https://github.com/anotherorg/anotherproject/blob/deadbeef/some/file.txt#L120-L125) test');

      });

      it('transforms ticket links', function() {
         var input = 'This is a link to ticket #123',
             expected = 'This is a link to ticket [#123](https://github.com/silvermine/git-branching-wiki/issues/123)';

         expect(plugin.transformTicketLinks(input)).to.eql(expected);
      });

   });

   describe('raw markdown transformation - all together', function() {

      it('needs a better test (TODO)', function() {
         expect(plugin.transformRawMarkdown('test')).to.be('test');
      });

   });

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
