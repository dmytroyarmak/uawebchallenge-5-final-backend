var request = require('request');
var Q = require('q');
var _ = require('underscore');
var config = require('./config');

var buildAccountRequestOptions = function(account_id, path) {
  return {
    url: config.wotApi.baseUrl + path,
    qs: {
      application_id: config.applicationId,
      account_id: account_id
    }
  };
};

var buildAccountInfoRequestOptions = function(account_id) {
  return buildAccountRequestOptions(account_id, config.wotApi.accountInfoUrl);
};

var buildAccountTanksRequestOptions = function(account_id) {
  return buildAccountRequestOptions(account_id, config.wotApi.accountTanksUrl);
};

var extractStatistics = function(account_id, body) {
  var result = JSON.parse(body);
  return result.data[account_id.toString()].statistics.all;
};

var extractTanks = function(account_id, body) {
  var result = JSON.parse(body);
  return _.pluck(result.data[account_id.toString()], 'tank_id');
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
  var requestOptions = buildAccountTanksRequestOptions(account_id);
  console.log('Make request for acount tanks. Account id: ' + account_id);
  request(requestOptions, function (error, response, body) {
    if (error) {
      console.log('Request for acount tanks error. Account id: ' + account_id);
      defer.reject(error);
    } else {
      console.log('Request for acount tanks success. Account id: ' + account_id);
      var tanks = extractTanks(account_id, body);
      defer.resolve(tanks);
    }
  });
  return defer.promise;
};
