'use strict';
var rest = require('restler'),
    Q = require('q');

var dbLookup = 'http://localhost:5000',
    dbISBNs = '/isbns',
    dbBooks = '/books',
    dbRefs = 'refs';

var pluginManager = 'http://localhost:3000';

var getISBNs = function() {
    var defer = Q.defer();

    rest.get(dbLookup + dbISBNs, {
    }).on('success', function(collection) {
        defer.resolve(collection);
    }).on('fail', function(error) {
        defer.reject(error);
    });

    return defer.promise;
};

var getNewPrices = function(ISBN) {
    var defer = Q.defer();

    rest.get(pluginManager, {
        query: {
            'isbn': ISBN,
            'only': 'prices'
        }
    }).on('success', function(prices) {
        defer.resolve(prices);
    }).on('fail', function(error) {
        defer.reject(error);
    });

    return defer.promise;
};

var updatePrices = function(ISBN, prices) {
    var defer = Q.defer();
    rest.postJson(dbLookup + dbBooks + '/' +ISBN + dbRefs, prices, {
    }).on('success', function(response) {
        defer.resolve(response);
    }).on('fail', function(error) {
        defer.reject(error);
    });

    return defer.promise;
};

getISBNs().then(function(ISBNs) {

    ISBNs.forEach(function(data) {
        var ISBN = JSON.parse(data);
        getNewPrices(ISBN.isbn).then(function(prices) {
            // if necessary, build the prices array here
            // pass a JSON object to the function
            updatePrices(ISBN.isbn, prices).then(function(response) {
                console.log(response);
            })
            .fail(function(error) {
                console.log(error.message);
            });

        })
        .fail(function(error) {
            console.log(error.message);
        });
    });

})
.fail(function(error) {
    console.log(error.message);
});