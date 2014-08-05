var redis = require('redis');
var Q = require('q');
var logger = require('morgan');
var express = require('express')
var app = express();
var appName = process.env.APP_NAME || 'my-app';
var fileName = process.env.FILE_NAME || 'index';
var logFormat = process.env.LOG_FORMAT || 'short';
var defaultRedisUrl = 'redis://127.0.0.1:6379';

app.set('port', (process.env.PORT || 5000));

app.use(logger(logFormat));

app.get('/', function(request, response) {
  var redisUrl   = require("url").parse(process.env.REDISTOGO_URL || defaultRedisUrl);
  var client = require("redis").createClient(redisUrl.port, redisUrl.hostname);

  if(redisUrl.auth){
    client.auth(redisUrl.auth.split(":")[1]);
  }

  var manifestId = request.query['manifest_id'];
  var key = appName + ':' + fileName + ':';
  var content = null;

  if (manifestId) {
    key = key.concat(manifestId);
  } else {
    key = key.concat('current');
  }

  client.on('connect', function() {
    console.log('Connected to redis');
  });

  client.on('error', function(error) {
    console.log('Redis error: ' + error);
  });

  Q.ninvoke(client, 'get', key).then(function(html) {
    content = html;
  }, function(reason) {
    console.log('Error retrieving data from Redis: ', reason);
  }).finally(function() {
    client.quit();

    if (content) {
      response.send(content);
    } else {
      response.status(404).send('Not Found');
    }
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
