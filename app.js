var express = require('express');
var wotapi = require('./wotapi');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/account/:account_id/all_statistics', function(req, res){
  wotapi.getAllStatistics(req.params.account_id, function(result) {
    res.json(result);
  });
});

app.listen(3000);
console.log('Listening on port 3000');
