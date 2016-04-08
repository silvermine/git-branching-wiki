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
            var srcs = [ path.join(__dirname, '../../thirdparty'), path.join(__dirname, '../static') ],
                dest = this.getOutputSiteDirectory();

            // do the copying in serial (_.reduce rather than Q.all(_.map)) in case something in our local static folder
            // overwrites something in the thirdparty folder - that shouldn't happen, but at least we'll have
            // deterministic behavior
            return _.reduce(srcs, function(prev, src) {
               return prev.then(copy.bind(undefined, src, dest, { overwrite: true }));
            }, Q());
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
