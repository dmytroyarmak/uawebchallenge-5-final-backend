var request = require('request');
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
  var result = JSON.parse(body),
      statisticPerTank = result.data[account_id.toString()];
  return _.reduce(statisticPerTank, function(memo, stat) {
    memo.battles += stat.statistics.all.battles;
    memo.wins += stat.statistics.all.wins;
    return memo;
  },{battles: 0, wins: 0});
};

exports.getAllStatistics = function(account_id, callback) {
  var requestOptions = buildAccountInfoRequestOptions(account_id);
  request(requestOptions, function (error, response, body) {
    var statistics = extractStatistics(account_id, body);
    callback(statistics);
  });
};
