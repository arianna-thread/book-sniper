(function() {
  var Db, Q, Server, db, dbInstance;

  Db = require('mongodb').Db;

  Server = require('mongodb').Server;

  Q = require('q');

  dbInstance = void 0;

  db = function(config) {
    return {
      getConnection: function() {
        var deferred;
        deferred = Q.defer();
        if (!dbInstance) {
          db = new Db(config.dbName, new Server(config.dbHost, config.dbPort, {
            auto_reconnect: true,
            poolSize: 7
          }), {
            w: 1
          });
          db.open(function(err, dbI) {
            if (err) {
              deferred.reject(err);
              dbInstance = void 0;
              return;
            }
            dbInstance = dbI;
            dbInstance.open = function(cb) {
              return cb(void 0, dbInstance);
            };
            return deferred.resolve(dbInstance);
          });
        } else {
          deferred.resolve(dbInstance);
        }
        return deferred.promise;
      }
    };
  };

  module.exports = db;

}).call(this);
