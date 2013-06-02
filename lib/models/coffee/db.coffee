Db = require('mongodb').Db
Server = require('mongodb').Server
Q = require 'q'
dbInstance = undefined

db = (config) ->
    getConnection: () ->
        deferred = Q.defer()
        if !dbInstance
            db = new Db config.dbName, (new Server config.dbHost, config.dbPort,
                    auto_reconnect: true,
                    poolSize: 7
                ),
                    w: 1

            db.open (err, dbI) ->
                if err
                    deferred.reject err
                    dbInstance = undefined
                    return;
                dbInstance = dbI;
                dbInstance.open = (cb) ->
                    cb(undefined, dbInstance)

                deferred.resolve(dbInstance)
        else
            deferred.resolve dbInstance
        return deferred.promise

module.exports = db
