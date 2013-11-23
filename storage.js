var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var config = require('./config');


var getWotCollection = (function() {
  var collectionDefet = Q.defer();

  MongoClient.connect(config.mongoDbUrl, function(err, db) {
    if (err) {
      console.err('Error connection to mongodb');
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
        console.err('Error on saving data to mongodb');
        defer.reject(err);
      } else {
        console.log('Success saving data to mongodb');
        defer.resolve(result[0]);
      }
    });
  });
  return defer.promise;
};
