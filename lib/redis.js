'use strict';

var RSVP = require('rsvp');
var defaultRedisUrl = 'redis://127.0.0.1:6379';

module.exports = function() {
  var redisUrl   = require("url").parse(process.env.REDISTOGO_URL || defaultRedisUrl);
  var client;

  return {
    connect: function() {
      client = require("redis").createClient(redisUrl.port, redisUrl.hostname);

      if(redisUrl.auth){
        client.auth(redisUrl.auth.split(":")[1]);
      }

      client.on('error', function(error) {
        console.log('Redis error: ' + error);
      });

      return new RSVP.Promise(function(resolve, reject) {
        client.on('connect', function() {
          console.log('Connected to redis');
          resolve();
        });
      });
    },

    get: function(key) {
      return new RSVP.Promise(function(resolve, reject) {
        client.get(key, function(error, data) {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      })
    },

    quit: function() {
      client.quit();
    }
  }
};
