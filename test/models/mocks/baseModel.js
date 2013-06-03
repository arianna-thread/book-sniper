(function() {
  var Q;

  Q = require("q");

  module.exports = function() {
    var cacheGet, cacheInsert, cacheModify, expectGet, expectInsert;
    cacheGet = {};
    cacheInsert = {};
    cacheModify = {};
    return {
      expectGet: expectGet = function(collectionName, response) {
        if (!cacheGet[collectionName]) {
          cacheGet[collectionName] = [];
        }
        return cacheGet[collectionName].push(response);
      },
      expectInsert: expectInsert = function(collectionName, response) {
        if (!cacheInsert[collectionName]) {
          cacheInsert[collectionName] = [];
        }
        return cacheInsert[collectionName].push(response);
      },
      expectModify: function(collectionName, response) {
        if (!cacheModify[collectionName]) {
          cacheModify[collectionName] = [];
        }
        return cacheModify[collectionName].push(response);
      },
      _getById: function(id, collectionName) {
        var deferred;
        deferred = Q.defer();
        if (!cacheGet[collectionName] || cacheGet[collectionName].length <= 0) {
          throw "Unexpected get by id, id:" + id + " collection " + collectionName;
        }
        deferred.resolve(cacheGet[collectionName].shift());
        return deferred.promise;
      },
      _getAll: function(collectionName, queryObj) {
        var deferred;
        deferred = Q.defer();
        if (!cacheGet[collectionName] || cacheGet[collectionName].length <= 0) {
          throw "Unexpected getAll on collection " + collectionName + " queryObj: " + JSON.stringify(queryObj);
        }
        deferred.resolve(cacheGet[collectionName].shift());
        return deferred.promise;
      },
      _insert: function(collectionName, items) {
        var deferred;
        deferred = Q.defer();
        if (!cacheInsert[collectionName] || cacheInsert[collectionName].length <= 0) {
          throw "Unexpected insert on collection " + collectionName + " items: " + JSON.stringify(items);
        }
        deferred.resolve(cacheInsert[collectionName].shift());
        return deferred.promise;
      },
      _replace: function(collectionName, item) {
        var deferred;
        deferred = Q.defer();
        if (!cacheModify[collectionName] || cacheModify[collectionName].length <= 0) {
          throw "Unexpected replace on collection " + collectionName + " items: " + JSON.stringify(items);
        }
        deferred.resolve(cacheModify[collectionName].shift());
        return deferred.promise;
      },
      _update: function(collectionName, query, update, multi) {
        var deferred;
        if (multi == null) {
          multi = false;
        }
        deferred = Q.defer();
        if (!cacheModify[collectionName] || cacheModify[collectionName].length <= 0) {
          throw "Unexpected update on collection " + collectionName + " items: " + JSON.stringify(items);
        }
        deferred.resolve(cacheModify[collectionName].shift());
        return deferred.promise;
      }
    };
  };

}).call(this);
