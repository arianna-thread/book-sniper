'use strict';
var err = require('../models/errors');
//dbLookup: URI for DB
//pluginManagerLookup: URI for PGM
module.exports = function (dbLookup, pluginManagerLookup) {
    var rest = require('restler'),
        Q = require('q'),
        express = require('express'),
        app = express();

    //look for a resource given URI on an endpoint
    var lookupByUri = function (uri, lookup) {
        console.log(lookup + ' - look for : ' + uri);
        var defer = Q.defer();
        rest.get(lookup, {
            query: {
                'uri': uri
            }
        }).on('success', function (book) {
            defer.resolve(book);
        }).on('fail', function (error) {
            defer.reject(error);
        });
        return defer.promise;
    };

    //get a book given its URI on DB or enable tracking on it
    var getByUri = function (uri) {
        // var defer = Q.defer();
        //look in db for a book given a URI
        return lookupByUri(uri, dbLookup).then(function (book) {
            //if book is found in db, defer it
            console.log('book from db found');
            return book;
        }).fail(function (error) {
            //if book isn't in db, ask to PGM
            console.log('Book not found in DB, asking PGM...');
            return lookupByUri(uri, pluginManagerLookup).then(function (books) {
                //if book is found by PGM, insert/update book in db and defer it
                //note: it return bad URI

                if (books.error) {
                    return books;
                }
                var refs = books.map(function (book) {
                    return {
                        'source': book.source,
                        'price': book.price,
                        'date': book.date,
                        'uri': book.uri
                    };
                });
                var bookDB = {
                    'isbn': books[0].isbn,
                    'title': books[0].title,
                    'author': books[0].author,
                    'refs': refs
                };
                rest.postJson(dbLookup, bookDB);
                return bookDB;
            }).fail(function (error) {
                throw error;
            });
        });
    };

    //look for a book in DB given its ISBN
    var getByISBN = function (isbn) {
        var defer = Q.defer();
        rest.get(dbLookup + '/' + isbn).on('success', function (prices) {
            defer.resolve(prices);
        }).on('fail', function (error) {
            defer.reject(error);
        });
        return defer.promise;
    };

    //look for a book on a query
    var getByQuery = function (query) {
        var defer = Q.defer(),
            filter = {};
        if (query) {
            filter.query = {
                query: query
            };
        }
        rest.get(dbLookup, filter).on('success', function (data) {
            defer.resolve(data);
            console.log('Data received:',data);
        }).on('fail', function (error) {
            console.log('error received:',error);
            defer.reject(error);
        });
        return defer.promise;
    };

    app.configure(function () {
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(app.router);
    });

    app.configure('development', function () {
        app.use(express.errorHandler());
    });
    //get on books
    //param uri
    app.get('/books', function (req, res) {
        var uri = req.query.uri;
        var query = req.query.query;
        if (uri) {
            //promise = getByUri(uri)
            getByUri(uri).then(function (book) {
                //console.log(book);
                res.send(book);
            }).fail(function (error) {
                console.log(error);
            });
        } else if (query) {
            //console.log(query);
            getByQuery(query).then(function (data) {
                //console.log(data);
                res.send(data);
            }).fail(function (error) {
                console.error('Error while performing GET on /books with query', query, ':', error);
            });
        } else {
            console.error('No uri neither query specified');
            res.send(err.BAD_PARAMETER);
        }
    });

    app.get('/books/:isbn', function (req, res) {
        getByISBN(req.params.isbn).then(function (book) {
            console.log(book);
            res.send(book);
        }).fail(function (error) {
            console.error('Error while requesting details to the db:', error);
            res.send(err.BAD_PARAMETER);
        });
    });

    return app;
};
