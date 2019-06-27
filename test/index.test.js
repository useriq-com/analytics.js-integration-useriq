'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var integrationTester = require('@segment/analytics.js-integration-tester');
var integration = require('@segment/analytics.js-integration');
var sandbox = require('@segment/clear-env');
var UserIQ = require('../lib/');

describe('UserIQ', function() {
  var analytics;
  var userIQ;
  var options = { siteId: 'DUMMY_SITE_ID' };

  beforeEach(function() {
    analytics = new Analytics();
    userIQ = new UserIQ(options);
    analytics.use(integrationTester);
    analytics.use(UserIQ);
    analytics.add(userIQ);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    sandbox();
  });

  it('should have the correct options', function() {
    analytics.compare(UserIQ, integration('UserIQ').option('siteId', ''));
  });
});
