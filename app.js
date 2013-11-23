var express = require('express');
var wotapi = require('./wotapi');
var Q = require('q');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/account/:account_id/all_statistics', function(req, res){
  var account_id = req.params.account_id,
      gettingStats = wotapi.getAllStatistics(account_id),
      gettingTanks = wotapi.getAllTanks(account_id);
  Q.all([gettingStats, gettingTanks]).then(function(result) {
    res.json({
      statistics: result[0],
      tanks: result[1]
    });
  });
});

app.listen(3000);
console.log('Listening on port 3000');
