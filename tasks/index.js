/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
    Q = require('q'),
    BASE_TASK_NAME = 'gitwiki',
    TASK_DESC = 'Grunt tasks for the git-branching-wiki system.',
    DEFAULT_OPTS, STEPS;

DEFAULT_OPTS = {
   input: {
      base: '.',
      git: '.git',
      docs: 'docs',
   },
   output: {
      base: 'dist',
      raw: 'raw',
      site: 'site',
      workspaceDir: 'workspace',
      localBranchesDir: 'local-branches',
      tagsDir: 'tags',
      remoteBranchesDir: 'remote-branches',
   },
   templating: {
      globals: {
         site_title: 'Documentation Site'
      },
      markdown: {
         ticketLinks: 'https://github.com/silvermine/git-branching-wiki/issues/<%= number %>',
         commitLinks: {
            hashOnly: 'https://github.com/silvermine/git-branching-wiki/commit/<%= hash %>',
            crossRepo: 'https://github.com/<%= group %>/<%= repo %>/commit/<%= hash %>',
         },
         codeLinks: {
            defaultRevision: 'master',
            defaultGroup: 'silvermine',
            defaultRepo: 'git-branching-wiki',
            url: 'https://github.com/<%= group %>/<%= repo %>/blob/<%= revision %>/<%= filepath %><% if (startingLine) { %>#L<%= startingLine %><% if (endingLine) { %>-L<%= endingLine %><% } } %>',
         }
      },
   },
};

STEPS = {
   'export': require('../src/grunt/GitExporter'),
   'build': require('../src/grunt/SiteBuilder'),
   'watch': require('../src/grunt/RepoWatcher'),
};

module.exports = function(grunt) {

   grunt.registerTask(BASE_TASK_NAME, TASK_DESC, function() {
      var steps = _.isEmpty(this.args) ? _.keys(STEPS) : this.args,
          opts = this.options(DEFAULT_OPTS),
          done = this.async(),
          promise;

      grunt.log.writeln('%s running "%s" steps', BASE_TASK_NAME, steps);

      promise = _.reduce(steps, function(prev, step) {
         var Step = STEPS[step],
             step = new Step(grunt, opts);

         return prev
            .then(function() {
               return Q(step.prepare());
            })
            .then(function() {
               return Q(step.run());
            });
      }, Q(true));

      promise.then(done).catch(done);
   });

};

module.exports.DEFAULT_OPTS = DEFAULT_OPTS;
