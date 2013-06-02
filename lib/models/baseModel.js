(function() {
  var BSON, Q;

  Q = require("q");

  BSON = require("mongodb").BSONPure;

  module.exports = function(db) {
    var getAll;
    return {
      afterGet: function(element) {
        return element;
      },
      beforeInsert: function(element) {
        return element;
      },
      _getById: function(collectionName, id) {
        var deferred, that;
        deferred = Q.defer();
        that = this;
        db.getConnection().then(function(dbInstance) {
          return dbInstance.collection(collectionName, function(err, collection) {
            var cursor, oId;
            if (err) {
              console.error('[ERROR]', err);
              deferred.reject(err);
              return;
            }
            try {
              oId = new BSON.ObjectID(id);
            } catch (e) {
              deferred.reject(err);
              return;
            }
            cursor = collection.find({
              _id: oId
            });
            return cursor.nextObject(function(err, results) {
              if (err) {
                return deferred.reject(err);
              } else if (!results) {
                return deferred.reject({
                  err: "NO_RESULT"
                });
              } else {
                return deferred.resolve(that.afterGet(results));
              }
            });
          });
        });
        return deferred.promise;
      },
      _getAll: getAll = function(collectionName, queryObj, limit) {
        var deferred, that;
        deferred = Q.defer();
        that = this;
        db.getConnection().then(function(dbInstance) {
          return dbInstance.collection(collectionName, function(err, collection) {
            var cursor, documents;
            if (err) {
              deferred.reject(err);
              return;
            }
            cursor = collection.find(queryObj);
            if (typeof limit === "number") {
              cursor = cursor.limit(limit);
            }
            documents = [];
            return cursor.count(function(err, size) {
              if (err) {
                deferred.reject(err);
                console.error("[ERROR]", err);
                return;
              }
              if (size === 0) {
                deferred.resolve([]);
                return;
              }
              return cursor.each(function(err, document) {
                var item;
                if (err) {
                  deferred.reject(err);
                  console.error("[ERROR]", err);
                  return;
                }
                if (document === null) {
                  deferred.resolve(documents);
                  return;
                }
                item = that.afterGet(document);
                documents.push(item);
                return deferred.notify(item);
              });
            });
          });
        });
        return deferred.promise;
      },
      _insert: function(collectionName, items) {
        var deferred;
        deferred = Q.defer();
        if (Array.isArray(items)) {
          items.map(this.beforeInsert, this);
        } else {
          items = this.beforeInsert(items);
        }
        db.getConnection().then(function(dbInstance) {
          return dbInstance.collection(collectionName, function(err, collection) {
            if (err) {
              deferred.reject(err);
              return;
            }
            return collection.insert(items, function(err, result) {
              if (err) {
                console.log(err);
                deferred.reject(err);
                return;
              }
              return deferred.resolve(result);
            });
          });
        }).fail(function(err) {
          return deferred.reject(err);
        });
        return deferred.promise;
      }
    };
  };

}).call(this);
