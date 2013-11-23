var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var _ = require('underscore');
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


exports.getClosestTo = function(account_id, date) {
  var defer = Q.defer();
  defer.resolve({
    tanks: [1, 2, date%23,date%57,date%32],
    statistics: {
      foo: date%4,
      bar: date%7
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
    defer.resolve({
      res: statsDifference(result[0], result[1]),
      test: result
    });
  });

  return defer.promise;
};
