Q = require 'q'

module.exports = (books, errors) ->
    searchByUri: (uri) ->
        books.getByUri(uri).then (book) ->
            if book? 
                book 
            else 
                throw errors.NOT_FOUND 

    getByISBN: (ISBN) ->
        books.getByISBN(ISBN).then (book) ->
            if book? 
                book 
            else 
                throw errors.NOT_FOUND

    fullTextQuery: (query) ->
        books.query(query)


    createBook: (book) ->
        if checkBook(book) is false
            return Q.reject errors.BAD_PARAMETER
        books.getByISBN(book.isbn).then (oldBook) ->
            if oldBook?
                return oldBook
            books.create(book)

    addPrices: (ISBN, prices) ->
        books.addPrices(ISBN, prices).then (count) ->
            if count is 0
                throw errors.NOT_FOUND
            else
                books.getByISBN ISBN

    

checkBook = (book) ->
    book.title? and book.isbn? and Array.isArray(book.refs)
    
