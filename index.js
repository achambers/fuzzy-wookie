var express = require('express')
var logger = require('morgan');
var app = express();
var logFormat = process.env.LOG_FORMAT || 'short';

app.set('port', (process.env.PORT || 5000));

app.use(logger(logFormat));

app.get('/*', function(request, response) {
  var redis = require('./lib/redis')();
  var manifestId = request.query['key'] || 'current';
  var key = 'index:' + manifestId;

  redis.connect()
  .then(function() {
    return redis.get(key);
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
    redis.quit();
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
