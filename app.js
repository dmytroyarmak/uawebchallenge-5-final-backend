var express = require('express');
var wargamingapi = require('./wargamingapi');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/account/:account_id/all_statistics', function(req, res){
  var result = wargamingapi.getAllStatistics(req.params.account_id);
  res.send(result);
});

app.listen(3000);
console.log('Listening on port 3000');
