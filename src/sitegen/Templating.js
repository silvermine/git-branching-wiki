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
      var loader = new nunjucks.FileSystemLoader(TEMPLATE_BASE),
          environment = new nunjucks.Environment(loader);

      _.each(files, function(file, name) {
         var template = DEFAULT_TEMPLATE,
             content, context;

         if (file.template) {
            template = file.template + '.html';
         }

         this.grunt.log.debug('Rendering template for "%s"', name);
         context = _.extend(
            {},
            { metadata: metalsmith.metadata() },
            file,
            { contents: file.contents.toString() }
         );

         content = environment.render(template, context);
         file.contents = new Buffer(content);
      }.bind(this));

      done();
   },

});
