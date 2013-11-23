var request = require('request');
var config = require('./config');

var buildAccountInfoRequestOptions = function(account_id) {
  return {
    url: config.wotApi.baseUrl + config.wotApi.accountInfoUrl,
    qs: {
      application_id: config.applicationId,
      account_id: account_id,
      json: true
    }
  };
};

exports.getAllStatistics = function(account_id, callback) {
  var requestOptions = buildAccountInfoRequestOptions(account_id);
  request(requestOptions, function (error, response, body) {
    callback(body);
  });
};
