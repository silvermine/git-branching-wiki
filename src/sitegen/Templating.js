/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    path = require('path'),
    nunjucks = require('nunjucks'),
    BasePlugin = require('./BasePlugin'),
    TEMPLATE_BASE = path.join(__dirname, '../templates'),
    DEFAULT_TEMPLATE = 'page.html';

module.exports = BasePlugin.extend({

   run: function(files, metalsmith, done) {
      // TODO: make it so that users can override the templates with their own
      var loader = new nunjucks.FileSystemLoader(TEMPLATE_BASE),
          environment = new nunjucks.Environment(loader);

      _.each(files, function(file, name) {
         var template = DEFAULT_TEMPLATE,
             rendered, context;

         if (file.template) {
            template = file.template + '.html';
         }

         this.grunt.log.debug('Rendering template "%s" for "%s"', template, name);

         context = {
            globals: _.extend({}, metalsmith.metadata(), this.opts.templating.globals),
            page: _.extend({}, file, { contents: file.contents.toString() }),
         };

         environment.addGlobal('util', this._createTemplateUtility(file));
         rendered = environment.render(template, context);
         file.contents = new Buffer(rendered);
      }.bind(this));

      done();
   },

   _createTemplateUtility: function(file) {
      return {
         path: function(toURL) {
            var from = path.dirname(file.url).replace(/^\//, ''),
                to = toURL.replace(/^\//, '');

            return path.relative(from, to);
         },
      };
   },

});
