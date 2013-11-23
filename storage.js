var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var _ = require('underscore');
var wotapi = require('./wotapi');
var config = require('./config');


var getWotCollection = (function() {
  var collectionDefet = Q.defer();

  MongoClient.connect(config.mongoDbUrl, function(err, db) {
    if (err) {
      console.log('Error connection to mongodb');
      collectionDefet.reject(err);
    } else {
      console.log('Success connection to mongodb');
      collectionDefet.resolve(db.collection('wot'));
    }
  });

  return function() {
    console.log('Request collection from mongodb');
    return collectionDefet.promise;
  };
})();

exports.write = function(data) {
  var defer = Q.defer();
  getWotCollection().then(function(collection) {
    console.log('Success getting collection fro mongodb');
    collection.insert(data, function(err, result) {
      if (err) {
        console.log('Error on saving data to mongodb');
        defer.reject(err);
      } else {
        console.log('Success saving data to mongodb');
        defer.resolve(result[0]);
      }
    });
  });
  return defer.promise;
};

// Get record closest to specific date
exports.getClosestTo = function(account_id, date) {
  var defer = Q.defer(),
      deferGt = Q.defer(),
      deferLt = Q.defer();

  getWotCollection().then(function(collection) {
    collection.findOne({account_id: account_id, date: {$lt: date}}, {sort: 'date'}, function(err, res) {
      deferLt.resolve(res);
    });
    collection.findOne({account_id: account_id, date: {$gte: date}}, {sort: ['date', 'desc']}, function(err, res) {
      deferGt.resolve(res);
    });
  });

  Q.all([deferLt.promise, deferGt.promise]).then(function(result) {
    var ltDateResult = result[0],
        ltDate = ltDateResult.date,
        gteDateResult = result[1],
        gteDate = gteDateResult.date,
        ltDateDiff = date - ltDate,
        gteDateDiff = gteDate - date;

    if (ltDateDiff < gteDateDiff) {
      defer.resolve(ltDateResult);
    } else {
      defer.resolve(gteDateResult);
    }
  });

  return defer.promise;
};

var statsDifference = function(oldStats, newStats) {
  return {
    statistics: statisticsDifference(oldStats.statistics, newStats.statistics),
    tanks: tanksDifference(oldStats.tanks, newStats.tanks)
  };
};

var statisticsDifference = function(oldStatistics, newStatistics) {
  var diff = {};
  _.each(newStatistics, function(value, key) {
    diff[key] = value - oldStatistics[key];
  });
  return diff;
};

var tanksDifference = function(oldTanks, newTanks) {
  return _.difference(newTanks, oldTanks);
};

exports.getDifference = function(account_id, from, to) {
  var defer = Q.defer(),
      gettingFrom = exports.getClosestTo(account_id, from),
      gettingTo = exports.getClosestTo(account_id, to);
  console.log('Starting getting difference');
  Q.all([gettingFrom, gettingTo]).then(function(result) {
    console.log('Getting difference Success');
    var diff = statsDifference(result[0], result[1]);
    wotapi.getTanksInfo(diff.tanks).then(function(tanksInfo) {
      diff.tanks = tanksInfo;
      defer.resolve(diff);
    });
  });

  return defer.promise;
};
