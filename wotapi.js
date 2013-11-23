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

var buildTanksInfoRequestOptions = function(tanks) {
  return {
    url: config.wotApi.baseUrl + config.wotApi.tanksInfoUrl,
    qs: {
      application_id: config.applicationId,
      tank_id: _.first(tanks, 100).join(',')
    }
  };
};

var extractStatistics = function(account_id, body) {
  var result = JSON.parse(body);
  return result.data[account_id.toString()].statistics.all;
};

var extractTanks = function(account_id, body) {
  var result = JSON.parse(body);
  return _.pluck(result.data[account_id.toString()], 'tank_id');
};

var extractTanksInfo = function(body) {
  var result = JSON.parse(body);
  return _.map(result.data, function(tank) {
    return _.pick(tank, 'tank_id', 'localized_name', 'max_health', 'weight', 'engine_power', 'circular_vision_radius');
  });
};

exports.getStatistics = function(account_id) {
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

exports.getTanks = function(account_id) {
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

exports.getStatisticsAndTanks = function(account_id) {
  var gettingStats = exports.getStatistics(account_id),
      gettingTanks = exports.getTanks(account_id);
  return Q.all([gettingStats, gettingTanks]);
};

exports.getTanksInfo = function(tanks) {
  var defer = Q.defer();
  var requestOptions = buildTanksInfoRequestOptions(tanks);
  console.log('Make request for tanks info. Tanks: ' + tanks);
  request(requestOptions, function (error, response, body) {
    if (error) {
      console.log('Request for tanks info error. Tanks: ' + tanks);
      defer.reject(error);
    } else {
      console.log('Request for tanks info success. Tanks: ' + tanks);
      defer.resolve(extractTanksInfo(body));
    }
  });
  return defer.promise;
};
