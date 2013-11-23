var request = require('request');
var Q = require('q');
var _ = require('underscore');
var config = require('./config');

var buildAccountInfoRequestOptions = function(account_id) {
  return {
    url: config.wotApi.baseUrl + config.wotApi.accountInfoUrl,
    qs: {
      application_id: config.applicationId,
      account_id: account_id
    }
  };
};

var extractStatistics = function(account_id, body) {
  var result = JSON.parse(body);
  return result.data[account_id.toString()].statistics.all;
};

exports.getAllStatistics = function(account_id) {
  var defer = Q.defer();
  var requestOptions = buildAccountInfoRequestOptions(account_id);
  console.log('Make request for acount info. Account id: ' + account_id);
  request(requestOptions, function (error, response, body) {
    if (error) {
      console.log('Request for acount info error. Account id: ' + account_id);
      defer.reject(error);
    } else {
      console.log('Request for acount info success. Account id: ' + account_id);
      var statistics = extractStatistics(account_id, body);
      defer.resolve(statistics);
    }
  });
  return defer.promise;
};

exports.getAllTanks = function(account_id) {
  var defer = Q.defer();
  defer.resolve([1,2,3]);
  return defer.promise;
};
