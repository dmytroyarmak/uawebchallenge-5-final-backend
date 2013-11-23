var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.urlencoded());
app.use(express.json());

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
