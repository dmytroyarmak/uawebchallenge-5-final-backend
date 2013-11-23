var express = require('express');
var Q = require('q');
var wotapi = require('./wotapi');
var storage = require('./storage');
var validators = require('./validators');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/account/:account_id/stats/current', function(req, res){
  var account_id = parseInt(req.params.account_id, 10);
  wotapi.getStatisticsAndTanks(account_id).then(function(result) {
    var statsAndTanks = {
      statistics: result[0],
      tanks: result[1],
      date: new Date(),
      account_id: account_id
    };
    storage.write(statsAndTanks).then(function(result) {
      res.json(result);
    });
  });
});

app.get('/account/:account_id/stats/diff', function(req, res){
  var account_id = parseInt(req.params.account_id, 10);
  var period = validators.validatePeriod(req.query.from, req.query.to);
  if (period.errors) {
    console.log(period.errors);
    res.json({errors: period.errors});
  } else {
    storage.getDifference(account_id, period.from, period.to).then(function(result) {
      res.json(result);
    });
  }
});

app.listen(3000);
console.log('Listening on port 3000');
