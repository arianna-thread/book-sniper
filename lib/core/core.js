'use strict';
var rest = require('restler'),
    Q = require('q'),
    express = require('express'),
    app = express();

var dbLookup = 'http://localhost:5000/books';

var pluginManagerLookup = 'http://localhost:3000/books';

var lookupByUri = function(uri, lookup) {
        var defer = Q.defer();
        rest.get(lookup, {
            query: {
                'uri': uri
            }
        }).on('success', function(book) {
            defer.resolve(book);
        }).on('fail', function(error) {
            defer.reject(error);
        });
        return defer.promise;
    };

var getByUri = function(uri) {
        lookupByUri(uri, dbLookup).then(function(book) {
            console.log('book in db');
            return book;
        }).fail(function(error) {
            lookupByUri(uri, pluginManagerLookup).then(function(book) {
                console.log('book from pgm: ' + error);
                //post on db
                rest.postJson(dbLookup, book);
                return book;
            }).fail(function(error) {
                console.log('book not present: ' + error);
                return null;
            });
        });
    };

var getByISBN = function(isbn) {
        var defer = Q.defer();
        rest.get(dbLookup + '/' + isbn).on('success', function(prices) {
            defer.resolve(prices);
        }).on('fail', function(error) {
            defer.reject(error);
        });
        return defer.promise;
    };

var getByQuery = function(query) {
        var defer = Q.defer();
        rest.get(dbLookup, {
            query: {
                'query': query
            }
        }).on('success', function(prices) {
            defer.resolve(prices);
        }).on('fail', function(error) {
            defer.reject(error);
        });
        return defer.promise;
    };

app.get('/books/:uri', function(req, res) {
    res.send(getByUri(req.param('uri')));
});

app.get('/books/:isbn', function(req, res) {
    res.send(getByISBN(req.param('isbn')));
});

app.get('/books/:isbn', function(req, res) {
    res.send(getByQuery(req.param('query')));
});

app.listen(8000);