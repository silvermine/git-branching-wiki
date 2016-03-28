/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    marked = require('marked'),
    BasePlugin = require('./BasePlugin');

module.exports = BasePlugin.extend({

   transformCommitLinks: function(str) {
      var hashOnly = _.template(this.opts.templating.markdown.commitLinks.hashOnly),
          crossRepo = _.template(this.opts.templating.markdown.commitLinks.crossRepo);

      // hash-only format: commit:$hash
      str = str.replace(/\bcommit:([0-9A-Fa-f]+)\b/g, function(match, hash) {
         var href = hashOnly({ hash: hash });
         return '[' + hash + '](' + href + ')';
      });

      // cross-repo format: $group:$repo:$hash
      str = str.replace(/\b(([0-9a-zA-Z\-_]+):([0-9a-zA-Z\-_]+):([0-9A-Fa-f]+))\b/g, function(match, outer, group, repo, hash) {
         var href = crossRepo({ group: group, repo: repo, hash: hash });
         return '[' + outer + '](' + href + ')';
      });

      return str;
   },

   transformCodeLinks: function(str) {
      var template = _.template(this.opts.templating.markdown.codeLinks.url),
          regex;

      regex = '\\bsource:' + // preamble
              '(' + // start of linkText capture
              '([^@#\\s]+)' + // fullFilepath (includes group and repo if applicable)
              '(?:@([0-9A-Fa-f]+))?' + // revision
              '(?:#L([0-9]+)(?:-([0-9]+))?)?' + // line number(s)
              ')\\b'; // end of linkText capture

      regex = new RegExp(regex, 'g');
      // source:$filepath - link to a file in the repo
      // source:$filepath@$revision - link to a file in the repo at a specific branch (e.g. master) or revision (e.g. deadbeef)
      // source:$filepath#L120 - link to line 120 of a file
      // source:$filepath#L120-125 - link to lines 120-125 of a file
      // source:$filepath@$revision#L120-125 - link to lines 120-125 of a file at a specific revision
      // source:$group:$repo|$filepath@$revision#L120-125 - link to a file in another repo
      return str.replace(regex, function(match, linkText, fullFilepath, revision, startingLine, endingLine) {
         var pathParts = fullFilepath.split(/[:\|]/),
             group = (pathParts.length > 1 ? pathParts.shift() : undefined),
             repo = (pathParts.length > 1 ? pathParts.shift() : undefined),
             filepath = pathParts.shift(),
             args, href;

         args = {
            group: group || this.opts.templating.markdown.codeLinks.defaultGroup,
            repo: repo || this.opts.templating.markdown.codeLinks.defaultRepo,
            filepath: filepath,
            revision: revision || this.opts.templating.markdown.codeLinks.defaultRevision,
            startingLine: startingLine,
            endingLine: endingLine,
         };

         href = template(args);

         return '[' + linkText + '](' + href + ')';
      }.bind(this));
   },

   transformTicketLinks: function(str) {
      var template = _.template(this.opts.templating.markdown.ticketLinks);

      // ticket links: #12345
      return str.replace(/(\s)\#([0-9]+)\b/g, function(match, space, number) {
         var href = template({ number: number });
         return space + '[#' + number + '](' + href + ')';
      }.bind(this));
   },

   transformThumbnailMacros: function(str) {
      // thumbnails: {{thumbnail(some-big-image.png, size=400)}}
      return str.replace(/\{\{\s*thumbnail\(([^,]+), size=([^\)]+)\)\s*\}\}/g, function(match, path, size) {
         return '<a class="thumbnail" href="' + path + '"><img width="' + size + '" src="' + path + '" /></a>';
      });
   },

   transformRawMarkdown: function(str) {
      var transformations = [
         this.transformCommitLinks,
         this.transformCodeLinks,
         this.transformTicketLinks,
         this.transformThumbnailMacros,
      ];

      return _.reduce(transformations, function(memo, fn) {
         return fn.call(this, memo);
      }.bind(this), str);
   },

   run: function(files, metalsmith, done) {

      _.each(files, function(file, name) {
         var str = file.contents.toString();

         str = this.transformRawMarkdown(str);
         str = marked(str, {
            smartypants: true,
            gfm: true,
            breaks: true,
            tables: true,
            // TODO: add custom renderer
            // TODO: add code highlighting
         });

         file.contents = new Buffer(str);
         delete files[name];
         files[file.url] = file;
      }.bind(this));

      done();
   },

});
