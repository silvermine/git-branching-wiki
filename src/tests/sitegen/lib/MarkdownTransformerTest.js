/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    Transformer = require('../../../sitegen/lib/MarkdownTransformer'),
    Task = require('../../../../tasks/index'),
    transformer = new Transformer(Task.DEFAULT_OPTS.templating.markdown);

describe('Markdown transformation', function() {

   describe('individual pieces', function() {

      it('transforms hash-only commit links', function() {
         var input = 'Mention commit:deadbeef in a sentence.',
             expected = 'Mention [deadbeef](https://github.com/silvermine/git-branching-wiki/commit/deadbeef) in a sentence.';

         expect(transformer.transformCommitLinks(input)).to.eql(expected);
      });

      it('transforms cross-repo commit links', function() {
         var input = 'Mention anotherorg:anotherproject:deadbeef in a sentence.',
             expected = 'Mention [anotherorg:anotherproject:deadbeef](https://github.com/anotherorg/anotherproject/commit/deadbeef) in a sentence.';

         expect(transformer.transformCommitLinks(input)).to.eql(expected);
      });

      it('transforms thumbnail macros', function() {
         var input = 'Embed a {{ thumbnail(some-big-image.png, size=400) }} here.',
             expected = 'Embed a <a class="thumbnail" href="some-big-image.png"><img width="400" src="some-big-image.png" /></a> here.';

         expect(transformer.transformThumbnailMacros(input)).to.eql(expected);
      });

      it('transforms code links', function() {
         // source:$filepath - link to a file in the repo
         expect(transformer.transformCodeLinks('test source:some/file.txt test'))
            .to.eql('test [some/file.txt](https://github.com/silvermine/git-branching-wiki/blob/master/some/file.txt) test');

         // source:$filepath@$revision - link to a file in the repo at a specific branch (e.g. master) or revision (e.g. deadbeef)
         expect(transformer.transformCodeLinks('test source:some/file.txt@deadbeef test'))
            .to.eql('test [some/file.txt@deadbeef](https://github.com/silvermine/git-branching-wiki/blob/deadbeef/some/file.txt) test');

         // source:$filepath#L120 - link to line 120 of a file
         expect(transformer.transformCodeLinks('test source:some/file.txt#L120 test'))
            .to.eql('test [some/file.txt#L120](https://github.com/silvermine/git-branching-wiki/blob/master/some/file.txt#L120) test');

         // source:$filepath#L120-125 - link to lines 120-125 of a file
         expect(transformer.transformCodeLinks('test source:some/file.txt#L120-125 test'))
            .to.eql('test [some/file.txt#L120-125](https://github.com/silvermine/git-branching-wiki/blob/master/some/file.txt#L120-L125) test');

         // source:$filepath@$revision#L120-125 - link to lines 120-125 of a file at a specific revision
         expect(transformer.transformCodeLinks('test source:some/file.txt@deadbeef#L120-125 test'))
            .to.eql('test [some/file.txt@deadbeef#L120-125](https://github.com/silvermine/git-branching-wiki/blob/deadbeef/some/file.txt#L120-L125) test');

         // source:$group:$repo|$filepath@$revision#L120-125 - link to a file in another repo
         expect(transformer.transformCodeLinks('test source:anotherorg:anotherproject|some/file.txt@deadbeef#L120-125 test'))
            .to.eql('test [anotherorg:anotherproject|some/file.txt@deadbeef#L120-125](https://github.com/anotherorg/anotherproject/blob/deadbeef/some/file.txt#L120-L125) test');

      });

      it('transforms ticket links', function() {
         var input = 'This is a link to ticket #123',
             expected = 'This is a link to ticket [#123](https://github.com/silvermine/git-branching-wiki/issues/123)';

         expect(transformer.transformTicketLinks(input)).to.eql(expected);
      });

   });

   describe('all together', function() {

      it('needs a better test (TODO)', function() {
         expect(transformer.transformRawMarkdown('test')).to.be('test');
      });

   });

});
