
module.exports = (modelManager, books) ->
    express = require 'express'
    app = express()
    app.configure () ->
        app.use express.logger('dev')
        app.use express.bodyParser()
        app.use app.router

    app.get '/books', (req, res) ->
        urlParams = req.query
        query = urlParams.query
        uri = urlParams.uri
        promise = null
        if uri
            promise = modelManager.searchByUri(uri)
        else if query
            promise = modelManager.fullTextQuery(query)
        else
            promise = books.getAll()
        promise.then (data) ->
            sendResponse data, res
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/: #{JSON.stringify(err)}"

    app.get '/isbns', (req, res) ->
        modelManager.getISBNs().then (data) ->
            sendResponse data, res
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/: #{JSON.stringify(err)}"

    app.post '/books', (req, res) ->
        book = req.body
        modelManager.createBook(book).then (data) ->
            sendResponse data, res
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/: #{JSON.stringify(err)}"

    app.get '/books/:isbn', (req, res) ->
        isbn = req.params.isbn
        modelManager.getByISBN(isbn).then (data) ->
            sendResponse data, res
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/#{isbn}: #{JSON.stringify(err)}"

    app.put '/books/:isbn', (req, res) ->
        book = req.body
        books.replace(book).then (data) ->
            sendResponse data, res
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/#{isbn}: #{JSON.stringify(err)}"

    app.get '/books/:isbn/refs', (req, res) ->
        isbn = req.params.isbn
        modelManager.getByISBN(isbn).then (data) ->
            if data.code #error to be handled
                res.status(data.code).json(data)
            else
                res.json(data.refs);
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/#{isbn}/refs: #{JSON.stringify(err)}"

    app.post '/books/:isbn/refs', (req, res) ->
        isbn = req.params.isbn
        prices = req.body
        modelManager.addPrices(isbn, prices).then (data) ->
            sendResponse data, res
        ,(data) ->
            sendResponse data, res
        .fail (err) ->
            console.error "Error while processing request on /books/#{isbn}/refs: #{JSON.stringify(err)}"

    return app

sendResponse = (data, res) ->
    if data.code #error to be handled
        res.status(data.code).json(data)
    else
        res.json(data)
