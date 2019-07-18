'use strict';

/**
 * Module dependencies.
 */
var integration = require('@segment/analytics.js-integration');
var each = require('@ndhoule/each');
var when = require('do-when');
var reject = require('reject');

var REQUIRED_ATTRS = {
  user_id: 1,
  user_name: 1,
  // user_email: 1,
  account_id: 1
  // account_name: 1,
  // signup_date: 1,
};

/**
 * Expose `UserIQ` integration.
 */
var UserIQ = (module.exports = integration('UserIQ')
  .option('siteId', '')
  .tag('<script·src="https://feed.useriq.com/useriq.js">'));

/**
 * Initialize.
 *
 * @api public
 */
UserIQ.prototype.initialize = function() {
  var self = this;
  // this is what we do in the tracking snippet
  // basically we make proxy methods & once the tag is
  // loaded, we call the actual methods

  // store all the identity info & group calls before starting the tracker
  self._userInfo = {};

  var useriq = (window._uiq = window._uiq || []);
  if (useriq.invoked && window.console && console.error) {
    console.error('Useriq snippet already exists.');
  }

  useriq.invoked = true;
  useriq.methods = [
    'setSiteId',
    'startTracker',
    'setDoNotTrack',
    'identify',
    'track',
    'group'
  ];

  useriq.factory = function(e) {
    return function() {
      var r = Array.prototype.slice.call(arguments);
      r.unshift(e);
      useriq.push(r);
      return useriq;
    };
  };

  for (var i = 0; i < useriq.methods.length; i++) {
    var key = useriq.methods[i];
    useriq[key] = useriq.factory(key);
  }

  this.load(function() {
    when(self.loaded, function() {
      useriq.setSiteId(self.options.siteId);

      // copy
      var obj = {};
      for (var key in self._userInfo) {
        if (self._userInfo.hasOwnProperty(key)) {
          obj[key] = self._userInfo[key];
        }
      }

      var userId = obj.user_id;
      delete obj.user_id;

      useriq.identify(userId, obj);
      useriq.startTracker();
    });
  });
};

/**
 * Loaded?
 *
 * @api public
 * @return {boolean}
 */
UserIQ.prototype.loaded = function() {
  // TODO: Check with @cal if it is reliable to watch this var `Useriq` for
  // loading of tracking snippet
  if (!window.Useriq) return false;

  for (var key in REQUIRED_ATTRS) {
    if (!this._userInfo[key]) return false;
  }

  return true;
};

/**
 * Identify
 *
 * @api public
 */
UserIQ.prototype.identify = function(identify) {
  var self = this;

  if (identify.userId()) self._userInfo.user_id = identify.userId();

  // send common traits
  // the partner sdk throws TypeErrors/Uncaughts if you pass `undefined`
  var traitsMap = {
    email: 'user_email',
    name: 'user_name',
    username: 'user_name',
    birthday: 'birthday',
    signup_date: 'signup_date'
  };
  var traits = reject(identify.traits()); // strip undefined/null

  each(function(value, key) {
    // transpose the keys if present, everything else will be sent as it is with the
    // same key as a custom_var
    var uiqKey = key;
    if (key in traitsMap) {
      uiqKey = traitsMap[key];
    }
    self._userInfo[uiqKey] = value;
  }, traits);
};

/**
 * Group
 *
 * @api public
 */
UserIQ.prototype.group = function(group) {
  var self = this;

  if (group.groupId()) self._userInfo.account_id = group.groupId();

  var traits = group.traits();

  each(function(key, value) {
    var uiqKey = key;
    // rename key to account_name
    if (key === 'name') uiqKey = 'account_name';
    self._userInfo[uiqKey] = value;
  }, traits);
};
