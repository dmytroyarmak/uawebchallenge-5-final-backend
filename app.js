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
  var account_id = req.params.account_id;
  wotapi.getStatisticsAndTanks(account_id).then(function(result) {
    var statsAndTanks = {
      statistics: result[0],
      tanks: result[1],
      date: new Date()
    };
    storage.write(statsAndTanks).then(function(result) {
      res.json(result);
    });
  });
});

app.listen(3000);
console.log('Listening on port 3000');
