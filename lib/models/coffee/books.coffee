Q = require 'q'
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
        if (typeof ISBN) isnt 'string' or ISBN.length isnt 13
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
        if (typeof ISBN) isnt 'string' or ISBN.length isnt 13
            return Q.reject errors.INVALID_ISBN
        @_insert 'books', book

    return books

module.exports = booksFactory
