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

  /*
  describe("before loading", function() {
    beforeEach(function() {
      analytics.stub(userIQ, "load");
    });

    describe("#initialize", function() {
      it("should call load", function() {
        analytics.initialize();
        analytics.called(userIQ.load);
      });
    });
  });

  describe("loading", function() {
    it("should load", function(done) {
      analytics.load(userIQ, done);
    });
  });

  describe("after loading", function() {
    beforeEach(function(done) {
      analytics.once("ready", done);
      analytics.initialize();
    });

    describe("#identify", function() {
      beforeEach(function() {
        analytics.stub(userIQ.client, "add_first_name");
        analytics.stub(userIQ.client, "add_last_name");
        analytics.stub(userIQ.client, "add_email");
        analytics.stub(userIQ.client, "add_mobile");
        analytics.stub(userIQ.client, "add_user_name");
        analytics.stub(userIQ.client, "add_gender");
        analytics.stub(userIQ.client, "add_birthday");
        analytics.stub(userIQ.client, "add_user_attribute");
        analytics.stub(userIQ.client, "add_unique_user_id");
        analytics.stub(userIQ.client, "destroy_session");
      });

      it("should send identify", function() {
        var traits = {
          firstName: "han",
          lastName: "solo",
          email: "han@segment.com",
          phone: "4012229047",
          name: "han solo",
          gender: "male",
          birthday: "08/13/1991",
          customTrait: true
        };
        analytics.identify("han123", traits);
        analytics.called(userIQ.client.add_unique_user_id, "han123");
        analytics.called(userIQ.client.add_first_name, traits.firstName);
        analytics.called(userIQ.client.add_last_name, traits.lastName);
        analytics.called(userIQ.client.add_email, traits.email);
        analytics.called(userIQ.client.add_mobile, traits.phone);
        analytics.called(userIQ.client.add_user_name, traits.name);
        analytics.called(userIQ.client.add_gender, traits.gender);
        analytics.called(userIQ.client.add_birthday, traits.birthday);
        analytics.called(
          userIQ.client.add_user_attribute,
          "customTrait",
          traits.customTrait
        );
      });

      it("should fall back to traits.username", function() {
        var traits = { username: "prince oberyn" };
        analytics.identify("han123", traits);
        analytics.called(userIQ.client.add_user_name, traits.username);
      });

      it("it should handle traits.username", function() {
        var traits = {
          name:
            "Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons",
          username: "khaleesi"
        };
        analytics.identify("targaryen2", traits);
        analytics.called(userIQ.client.add_user_name, traits.name);
        analytics.called(
          userIQ.client.add_user_attribute,
          "username",
          traits.username
        );
      });

      it("should reject undefined values before calling partner methods", function() {
        analytics.identify("jon snow");
        analytics.didNotCall(userIQ.client.add_user_name);
        analytics.didNotCall(userIQ.client.add_user_attribute);
      });

      it("should destroy session if identify is called for a new user", function() {
        analytics.identify("drogon");
        var drogonAnonId = analytics.user().anonymousId();
        if (userIQ.initializedAnonymousId !== drogonAnonId) {
          throw new Error(
            "MoEngange anonymous ID should be equal after an identify call " +
              userIQ.initializedAnonymousId +
              " vs " +
              drogonAnonId +
              ""
          );
        }
        analytics.called(userIQ.client.add_unique_user_id, "drogon");
        analytics.identify("night king");
        var nightKingAnonId = analytics.user().anonymousId();
        if (nightKingAnonId === drogonAnonId) {
          throw new Error(
            "The anonymous ID should be different after an identify call"
          );
        }
        analytics.called(userIQ.client.destroy_session);
        analytics.called(userIQ.client.add_unique_user_id, "night king");
        if (userIQ.initializedAnonymousId !== nightKingAnonId) {
          throw new Error(
            "MoEngange anonymous ID should be equal after an identify call"
          );
        }
      });

      it("should not call destroy session if identify is called for a existing user", function() {
        analytics.identify("drogon");
        analytics.called(userIQ.client.add_unique_user_id, "drogon");
        analytics.identify("drogon");
        analytics.didNotCall(userIQ.client.destroy_session);
        analytics.called(userIQ.client.add_unique_user_id, "drogon");
      });
    });
  });
  */
});
