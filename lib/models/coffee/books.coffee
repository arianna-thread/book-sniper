Q = require 'q'
booksFactory = (baseModel) ->
    books = Object.create(baseModel)
    books.getAll = (filter = {}, limit) ->
        @_getAll('books', filter, limit)

    books.getByUri = (uri) ->
        if typeof uri isnt 'string' then return Q.reject "Expected #{uri} to be a string"
        filter = 
            'refs.uri': uri
        @getAll(filter).then (books) ->
            if books.length > 1
                throw  "Consistency error, multiple objects found with same uri: #{books}"
            if books.length is 1
                return books[0]
            return null

    books.getByISBN = (ISBN) ->
        if (typeof ISBN) isnt 'string' or ISBN.length isnt 13
            return Q.reject 'ISBN must be a 13-characters string'
        filter =
            isbn: ISBN
        @getAll(filter).then (books) ->
            if books.length > 1
                throw  "Consistency error, multiple objects found with same ISBN: #{books}"
            if books.length is 1
                return books[0]
            return null

    return books

module.exports = booksFactory
