/*
 * Copyright (c) 2016 Jeremy Thomerson
 * Licensed under the MIT license.
 */

'use strict';

var expect = require('expect.js'),
    Util = require('./MetalsmithPluginTestingUtility'),
    util = new Util(),
    PluginClass = require('../../sitegen/Templating'),
    plugin = util.createPlugin(PluginClass);

describe('Templating sitegen plugin', function() {

   // TODO: consider if there a way to test the actual templating without tight coupling

   describe('template utility', function() {

      describe('path function', function() {

         it('basically works', function() {
            var templateUtil = plugin._createTemplateUtility({ url: 'workspace/a/b/c/index.html' });

            expect(templateUtil.path('css/bootstrap.min.css')).to.eql('../../../../css/bootstrap.min.css');
            expect(templateUtil.path('workspace/a/b/c/OtherPage.html')).to.eql('OtherPage.html');
            expect(templateUtil.path('workspace/a/OtherFolderPage.html')).to.eql('../../OtherFolderPage.html');
         });

         it('works with slashes in either or both URLs', function() {
            var templateUtil = plugin._createTemplateUtility({ url: 'workspace/a/b/c/index.html' });

            // slash only in toURL
            expect(templateUtil.path('/css/bootstrap.min.css')).to.eql('../../../../css/bootstrap.min.css');
            expect(templateUtil.path('/workspace/a/b/c/OtherPage.html')).to.eql('OtherPage.html');
            expect(templateUtil.path('/workspace/a/OtherFolderPage.html')).to.eql('../../OtherFolderPage.html');

            // slash in utility file URL (src)
            templateUtil = plugin._createTemplateUtility({ url: '/workspace/a/b/c/index.html' });

            // and not in toURL
            expect(templateUtil.path('css/bootstrap.min.css')).to.eql('../../../../css/bootstrap.min.css');
            expect(templateUtil.path('workspace/a/b/c/OtherPage.html')).to.eql('OtherPage.html');
            expect(templateUtil.path('workspace/a/OtherFolderPage.html')).to.eql('../../OtherFolderPage.html');

            // and in toURL
            expect(templateUtil.path('/css/bootstrap.min.css')).to.eql('../../../../css/bootstrap.min.css');
            expect(templateUtil.path('/workspace/a/b/c/OtherPage.html')).to.eql('OtherPage.html');
            expect(templateUtil.path('/workspace/a/OtherFolderPage.html')).to.eql('../../OtherFolderPage.html');
         });

      });
   });
});
