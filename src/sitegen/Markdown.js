/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Remarkable = require('remarkable'),
    identify = require('identify'),
    BasePlugin = require('./BasePlugin'),
    MarkdownTransformer = require('./lib/MarkdownTransformer'),
    remarkable;

remarkable = new Remarkable({
   // Consider whether we should actually allow HTML in the source.
   // Likely not, but we need it right now because of the pre-transform.
   // We could probably do away with the pre-transform if we implement
   // custom Remarkable extension rules.
   html: true,
   typographer: true,
   quotes: '“”‘’',
});

module.exports = BasePlugin.extend({

   onInitialized: function() {
      this.transformer = new MarkdownTransformer(this.opts.templating.markdown);
   },

   run: function(files, metalsmith, done) {
      _.each(files, function(file, name) {
         var str = file.contents.toString();

         str = this.transformer.transformRawMarkdown(str);
         str = remarkable.render(str);
         str = identify(str);

         file.contents = new Buffer(str);
         delete files[name];
         files[file.url] = file;
      }.bind(this));

      done();
   },

});
