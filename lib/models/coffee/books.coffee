Q = require 'q'

validISBN = (ISBN) ->
    (typeof ISBN) is 'string' and ISBN?.length is 13

booksFactory = (baseModel, errors) ->
    books = Object.create(baseModel)
    books.getAll = (filter = {}, limit) ->
        @_getAll('books', filter, limit)

    books.getByUri = (uri) ->
        if typeof uri isnt 'string' then return Q.reject "Expected #{uri} to be a string"
        filter = 
            'refs.uri': uri
        @getAll(filter).then (books) ->
            if books.length > 1
                throw  errors.CONSISTENCY_ERROR_URI
            if books.length is 1
                return books[0]
            return null

    books.getByISBN = (ISBN) ->
        if not validISBN(ISBN)
            return Q.reject errors.INVALID_ISBN
        filter =
            isbn: ISBN
        @getAll(filter).then (books) ->
            if books.length > 1
                throw  errors.CONSISTENCY_ERROR_ISBN
            if books.length is 1
                return books[0]
            return null

    books.create = (book) ->
        ISBN = book?.isbn
        if not validISBN(ISBN)
            return Q.reject errors.INVALID_ISBN
        @_insert 'books', book

    books.replace = (book) ->
        ISBN = book?.isbn
        if not validISBN(ISBN)
            return Q.reject errors.INVALID_ISBN
        @_replace 'books', book
    
    books.query = (queryString) ->
        if (typeof queryString) isnt "string"
            return Q.reject errors.INVALID_QUERY
        matcher = new RegExp queryString
        filter = 
            $or: [
                {isbn: 
                    $regex: matcher
                }
                {title: 
                    $regex: matcher
                }
                { author: 
                    $regex: matcher
                }
            ]
        @getAll(filter)

    books.addPrices = (ISBN, prices) ->
        if not validISBN(ISBN)
            return Q.reject errors.INVALID_ISBN
        if not Array.isArray prices
            prices = [prices]
        filter = 
            isbn: ISBN
        update = 
            $pushAll: refs: prices
        @_update('books', filter, update, false)    

    return books

module.exports = booksFactory
