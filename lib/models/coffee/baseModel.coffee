Q = require("q")
BSON = require("mongodb").BSONPure
module.exports = (db) ->
    afterGet: (element) ->
        element

    beforeInsert: (element) ->
        element

    _getById: (collectionName, id) ->
        deferred = Q.defer()
        that = this
        
        db.getConnection().then (dbInstance) ->

            dbInstance.collection collectionName, (err, collection) ->

                if err
                    console.error '[ERROR]', err
                    deferred.reject err
                    return
                try 
                    oId = new BSON.ObjectID id
                catch e
                    # console.error '[ERROR]', e
                    deferred.reject err
                    return
                
                cursor = collection.find _id: oId
                cursor.nextObject (err, results) ->
                    if err
                        deferred.reject err
                    else if !results
                        deferred.reject err: "NO_RESULT"
                    else
                        deferred.resolve that.afterGet results

        deferred.promise

    _getAll: getAll = (collectionName, queryObj, limit) ->
        deferred = Q.defer()
        that = this

        db.getConnection().then (dbInstance) ->
            dbInstance.collection collectionName, (err, collection) ->
                if err
                    deferred.reject err
                    return
                cursor = collection.find queryObj

                cursor = cursor.limit(limit)  if typeof limit is "number"
                documents = []

                cursor.count (err, size) ->
                    if err
                        deferred.reject err
                        console.error "[ERROR]", err
                        return
                    if size is 0
                        deferred.resolve []
                        return
                    cursor.each (err, document) ->
                        if err
                            deferred.reject err
                            console.error "[ERROR]", err
                            return
                        if document is null
                            deferred.resolve documents
                            return

                        item = that.afterGet(document)
                        documents.push item
                        deferred.notify item
        deferred.promise




    #   catch e
    #     db.close()
    #     deferred.reject e
      
    #   # deferred.resolve([{}, {}, {}, {}]);
    #   deferred.promise

    _insert: (collectionName, items) ->
        deferred = Q.defer()
        if Array.isArray items 
            items.map @beforeInsert, this 
        else
            items = @beforeInsert(items)
        db.getConnection().then (dbInstance)->
            dbInstance.collection collectionName, (err, collection) ->
                if err
                    deferred.reject err
                    return
                collection.insert items, (err, result) ->
                    if err
                        console.log err
                        deferred.reject err
                        return
                    deferred.resolve result
        .fail (err) ->
            deferred.reject err
        deferred.promise



    #   deferred.promise

    # _bulkUpdate: (collectionName, query, update) ->
    #   deferred = Q.defer()
    #   db.open (err, db) ->
    #     if err
    #       db.close()
    #       deferred.reject err
    #       return
    #     db.collection collectionName, (err, collection) ->
    #       if err
    #         db.close()
    #         deferred.reject err
    #         return
    #       collection.update query, update,
    #         multi: true
    #       , (err, result) ->
    #         if err
    #           db.close()
    #           deferred.reject err
    #           return
    #         deferred.resolve result



    #   deferred.promise

    # _update: (item, collectionName) ->
    #   deferred = Q.defer()
    #   db.open (err, db) ->
    #     if err
    #       db.close()
    #       deferred.reject err
    #       return
    #     db.collection collectionName, (err, collection) ->
    #       if err
    #         db.close()
    #         deferred.reject err
    #         return
    #       collection.save item, (err, result) ->
    #         if err
    #           db.close()
    #           deferred.reject err
    #           return
    #         deferred.resolve result



      # deferred.promise
