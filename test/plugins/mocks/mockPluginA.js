'use strict';
var Q = require('q');

exports['getByURI'] = function(uri) {
    var defer = Q.defer();
    defer.resolve({
        isbn: '1234567891234',
        title: 'a',
        price: 10,
        author: 'b',
        date: '10'
    });
    return defer.promise;
};

exports['getByISBN'] = function(isbn) {
    var defer = Q.defer();
    defer.resolve({
        isbn: '1234567891234',
        title: 'a',
        price: 10,
        author: 'b',
        date: '10'
    });
    return defer.promise;
};

exports['raiseHand'] = function(uri, cb) {
    if (uri.match('http://ebay')) {
        cb('itunes');
    }
};