'use strict';
var rest = require('restler'),
    Q = require('q');
var dbISBNs = '/isbns',
    dbBooks = '/books',
    dbRefs = '/refs',
    config = require('./configUpdateManager');

var dbLookup = 'http://' + config.modelHost + ':' + config.modelPort,
    pluginManager = 'http://' + config.pgmHost + ':' + config.pgmPort + '/prices';


var getISBNs = function() {
    var defer = Q.defer();
    console.log('Asking the isbns to update to the database.');

    rest.get(dbLookup + dbISBNs, {}).on('success', function(collection) {
        console.log('ISBNS collection:', collection);
        defer.resolve(collection);
    }).on('fail', function(error) {
        console.log('error', error);
        defer.reject(error);
    }).on('complete', function(result) {
        console.log('On complete results: ', result);
    });

    return defer.promise;
};

var updatePrices = function(ISBN, prices) {
    var defer = Q.defer();
    rest.postJson(dbLookup + dbBooks + '/' + ISBN + dbRefs, prices, {}).on('success', function(response) {
        defer.resolve(response);
        console.log(response);
    }).on('fail', function(error) {
        console.log(error);
        defer.reject(error);
    });

    return defer.promise;
};

console.log('Updating process started.\nContacting pgm at address: ' + pluginManager + ' and models at address: ' + dbLookup);

getISBNs().then(function(ISBNs) {
    console.log(pluginManager);
    rest.get(pluginManager + '?isbns=' + JSON.stringify(ISBNs)).on('success', function(books) {

        books.forEach(function(book) {
            updatePrices(book.isbn, book.refs).then(function(response) {
                console.log(response);
            });

        });
    }).on('fail', function() {
        console.log('Unable to update the isbns requested');
    });

});

// setTimeout(function() {}, 7000);