"use strict";
var Promise = require("./rsvp/promise")["default"];
var EventTarget = require("./rsvp/events")["default"];
var denodeify = require("./rsvp/node")["default"];
var all = require("./rsvp/all")["default"];
var allSettled = require("./rsvp/all-settled")["default"];
var race = require("./rsvp/race")["default"];
var hash = require("./rsvp/hash")["default"];
var hashSettled = require("./rsvp/hash-settled")["default"];
var rethrow = require("./rsvp/rethrow")["default"];
var defer = require("./rsvp/defer")["default"];
var config = require("./rsvp/config").config;
var configure = require("./rsvp/config").configure;
var map = require("./rsvp/map")["default"];
var resolve = require("./rsvp/resolve")["default"];
var reject = require("./rsvp/reject")["default"];
var filter = require("./rsvp/filter")["default"];
var asap = require("./rsvp/asap")["default"];

config.async = asap; // default async is asap;

function async(callback, arg) {
  config.async(callback, arg);
}

function on() {
  config.on.apply(config, arguments);
}

function off() {
  config.off.apply(config, arguments);
}

// Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
if (typeof window !== 'undefined' && typeof window.__PROMISE_INSTRUMENTATION__ === 'object') {
  var callbacks = window.__PROMISE_INSTRUMENTATION__;
  configure('instrument', true);
  for (var eventName in callbacks) {
    if (callbacks.hasOwnProperty(eventName)) {
      on(eventName, callbacks[eventName]);
    }
  }
}

exports.Promise = Promise;
exports.EventTarget = EventTarget;
exports.all = all;
exports.allSettled = allSettled;
exports.race = race;
exports.hash = hash;
exports.hashSettled = hashSettled;
exports.rethrow = rethrow;
exports.defer = defer;
exports.denodeify = denodeify;
exports.configure = configure;
exports.on = on;
exports.off = off;
exports.resolve = resolve;
exports.reject = reject;
exports.async = async;
exports.map = map;
exports.filter = filter;