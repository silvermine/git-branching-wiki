/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    plugins = require('../../sitegen/plugins'),
    Task = require('../../../tasks/index');

describe('Plugins wrapper', function() {
   it('returns a list of plugins', function() {
      var result = plugins.list({}, Task.DEFAULT_OPTS);

      expect(result).to.be.an('array');

      _.each(result, function(plugin) {
         expect(plugin).to.be.a('function');
      });
   });
});
