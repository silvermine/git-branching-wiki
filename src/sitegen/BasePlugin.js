/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    path = require('path'),
    Class = require('class.extend');

module.exports = Class.extend({

   init: function(grunt, opts) {
      this.grunt = grunt;
      this.opts = opts;
      this.onInitialized();
   },

   run: _.noop,
   onInitialized: _.noop,

   /**
    * Filters a metalsmith files object down to only those files that have a certain extension.
    *
    * Options:
    *
    * invert: boolean, default false. By default, this function will give you files that *match*
    *         the extension(s) you provide. Pass `invert: true` in order to *reject* files that
    *         match those extensions instead (leaving only non-matching files).
    *
    * inplace: boolean, default false. By default, this function will return a *new* file object.
    *          Pass `inplace: true` in order to actually modify the passed-in files object.
    *
    * @param files metalsmith files object
    * @param extensions a string for an extension (e.g. 'md') or array of string extensions
    * @param options object see above
    * @return a metalsmith files object, filtered according to input
    */
   filterFilesByExtension: function(files, extensions, options) {
      var inverted;

      // allow for a single extension or an array of extensions:
      extensions = _.isArray(extensions) ? extensions : [ extensions ];
      // allow for undefined options:
      options = options || {};

      inverted = !!options.invert;

      return _.reduce(files, function(memo, file, name) {
         var isInList = _.contains(extensions, path.extname(name).substr(1)),
             include = (inverted ? !isInList : isInList);

         if (include) {
            memo[name] = file;
         } else if (options.inplace) {
            delete memo[name];
         }
         return memo;
      }, (options.inplace ? files : {}));
   },

});
