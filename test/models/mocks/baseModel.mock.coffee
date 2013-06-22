Q = require("q")
module.exports = ->
    cacheGet = {}
    cacheInsert = {}
    cacheModify = {}
    expectGet: expectGet = (collectionName, response) ->
        cacheGet[collectionName] = []  unless cacheGet[collectionName]
        cacheGet[collectionName].push response

    expectInsert: expectInsert = (collectionName, response) ->
        cacheInsert[collectionName] = []  unless cacheInsert[collectionName]
        cacheInsert[collectionName].push response

    expectModify: (collectionName, response) ->
        cacheModify[collectionName] = []  unless cacheModify[collectionName]
        cacheModify[collectionName].push response        
    # afterGet: function (element) {
    #     return element;
    # },
    _getById: (id, collectionName) ->
        deferred = Q.defer()
        throw "Unexpected get by id, id:" + id + " collection " + collectionName  if not cacheGet[collectionName] or cacheGet[collectionName].length <= 0
        deferred.resolve cacheGet[collectionName].shift()
        deferred.promise

    _getAll: (collectionName, queryObj) ->
        deferred = Q.defer()
        throw "Unexpected getAll on collection " + collectionName + " queryObj: " + JSON.stringify(queryObj)  if not cacheGet[collectionName] or cacheGet[collectionName].length <= 0
        deferred.resolve cacheGet[collectionName].shift()
        deferred.promise

    _insert: (collectionName, items) ->
        deferred = Q.defer()
        throw "Unexpected insert on collection " + collectionName + " items: " + JSON.stringify(items)  if not cacheInsert[collectionName] or cacheInsert[collectionName].length <= 0
        deferred.resolve cacheInsert[collectionName].shift()
        deferred.promise

    _replace: (collectionName, item) ->
        deferred = Q.defer()
        throw "Unexpected replace on collection " + collectionName + " items: " + JSON.stringify(items)  if not cacheModify[collectionName] or cacheModify[collectionName].length <= 0
        deferred.resolve cacheModify[collectionName].shift()
        deferred.promise

    _update: (collectionName, query, update, multi = false) ->
        deferred = Q.defer()
        throw "Unexpected update on collection " + collectionName + " query: " + JSON.stringify(query) + " update: " + JSON.stringify(update)  if not cacheModify[collectionName] or cacheModify[collectionName].length <= 0
        deferred.resolve cacheModify[collectionName].shift()
        deferred.promise
