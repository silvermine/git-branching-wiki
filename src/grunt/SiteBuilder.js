/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    copy = require('recursive-copy'),
    metalsmith = require('metalsmith'),
    plugins = require('../sitegen/plugins'),
    BaseStep = require('./BaseStep');

module.exports = BaseStep.extend({

   run: function() {
      var builder, start;

      builder = _.reduce(plugins.list(this.grunt, this.opts), function(memo, plugin) {
         return memo.use(plugin);
      }, metalsmith(process.cwd()));

      builder = builder
         .source(this.getOutputRawDirectory())
         .destination(this.getOutputSiteDirectory());

      start = _.now();
      return Q.ninvoke(builder, 'build')
         .then(function() {
            // TODO: make this configurable (users can override static assets)
            var src = path.join(__dirname, '../static/*'),
                dest = this.getOutputSiteDirectory();

            return Q.all(_.map(this.grunt.file.expand(src), function(oneSrc) {
               return copy(oneSrc, path.join(dest, path.basename(oneSrc)), { overwrite: true });
            }));
         }.bind(this))
         .then(function() {
            this.grunt.log.ok('site build completed in %s seconds', ((_.now() - start) / 1000));
         }.bind(this))
         .fail(function(e) {
            this.grunt.log.error('site build error', e, e.stack);
            throw e;
         }.bind(this));
   },

});
