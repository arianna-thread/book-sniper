'use strict';
var Q = require('q');
var errors = require('../../../errors/pluginError.js');
var books = [{
        uri: 'https://amazon/id431617571',
        price: 13.99,
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        isbn: '9782709638821',
        date: '2013-06-03T12:28:44.415Z',
        source: 'amazon'
    }, {
        uri: 'https://amazon/id431617572',
        price: 15,
        title: 'Steve B',
        author: 'Walter Isaacson',
        isbn: '9782709638822',
        date: '2013-06-03T12:28:44.415Z',
        source: 'amazon'
    }, {
        uri: 'https://amazon/id431617573',
        price: 17,
        title: 'Steve C',
        author: 'Walter Isaacson',
        isbn: '9782709638823',
        date: '2013-06-03T12:28:44.415Z',
        source: 'amazon'
    },


];



exports['getByURI'] = function(uri) {
    var defer = Q.defer();
    var booksSelected = books.filter(function(element) {
        if (element.uri === uri)
            return true;
    });

    if (booksSelected.length > 0) {
        defer.resolve(booksSelected[0]);
    } else {
        defer.reject(errors.factory('invalidURI'));
    }
    return defer.promise;
};

exports['getByISBN'] = function(isbn) {
    var defer = Q.defer();

    var booksSelected = books.filter(function(element) {
        if (element.isbn === isbn) return true;
    });

    if (booksSelected.length > 0) {
        defer.resolve(booksSelected[0]);
    } else {
        defer.reject(errors.factory('invalidISBN'));
    }
    return defer.promise;
};

exports['raiseHand'] = function(uri, cb) {
    if (uri.match('https://amazon')) {
        cb(true, 'mockAmazon');
    } else {
        cb(false);
    }
};