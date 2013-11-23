var request = require('request');
var config = require('./config');

var buildAccountInfoUrl = function(account_id) {
  return config.wotApi.baseUrl + config.wotApi.accountInfoUrl;
};

exports.getAllStatistics = function(account_id, callback) {
  var requestUrl = buildAccountInfoUrl(account_id);
  request(requestUrl, function (error, response, body) {
    callback(body);
  });
};
