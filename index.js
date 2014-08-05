var redis = require('redis');
var RSVP = require('rsvp');
var logger = require('morgan');
var express = require('express')
var app = express();
var logFormat = process.env.LOG_FORMAT || 'short';
var defaultRedisUrl = 'redis://127.0.0.1:6379';
var client;

app.set('port', (process.env.PORT || 5000));

app.use(logger(logFormat));

app.get('/', function(request, response) {
  var manifestId = request.query['manifest-id'] || 'current';
  var key = 'index:' + manifestId;
  var content = null;

  connect()
  .then(function() {
    return get(key);
  })
  .then(function(data) {
    if (data) {
      response.send(data);
    } else {
      response.status(404).send('Not Found');
    }
  })
  .catch(function(error) {
    console.log('Error retrieving data from Redis: ', reason);
  })
  .finally(function() {
    client.quit();
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

function connect() {
  var redisUrl   = require("url").parse(process.env.REDISTOGO_URL || defaultRedisUrl);
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
}

function get(key) {
  return new RSVP.Promise(function(resolve, reject) {
    client.get(key, function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  })
};

