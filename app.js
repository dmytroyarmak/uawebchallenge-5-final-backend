var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/account/:account_id/all_statistics', function(req, res){
  res.send('All statistics for ' + req.params.account_id);
});

app.listen(3000);
console.log('Listening on port 3000');
