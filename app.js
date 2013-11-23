var express = require('express');
var moment = require('moment');
var Q = require('q');
var wotapi = require('./wotapi');
var storage = require('./storage');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/account/:account_id/all_statistics', function(req, res){
  var account_id = req.params.account_id,
      gettingStats = wotapi.getAllStatistics(account_id),
      gettingTanks = wotapi.getAllTanks(account_id);
  Q.all([gettingStats, gettingTanks]).then(function(result) {
    return storage.write({
      statistics: result[0],
      tanks: result[1],
      date: new Date()
    }).then(function(result) {
      console.log('Return result', result);
      res.json(result);
    });
  });
});

app.listen(3000);
console.log('Listening on port 3000');
