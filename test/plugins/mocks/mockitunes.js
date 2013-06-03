'use strict';
var Q = require('q');
var errors = require('../../../errors/pluginError.js');

var books = [{
        uri: 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11',
        price: 13.99,
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        isbn: '9782709638821',
        date: '2013-06-03T12:28:44.415Z'
    }, {
        uri: 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11',
        price: 15,
        title: 'Steve B',
        author: 'Walter Isaacson',
        isbn: '9782709638822',
        date: '2013-06-03T12:28:44.415Z'
    }, {
        uri: 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11',
        price: 17,
        title: 'Steve C',
        author: 'Walter Isaacson',
        isbn: '9782709638823',
        date: '2013-06-03T12:28:44.415Z'
    },


];



exports['getByURI'] = function(uri) {
    var defer = Q.defer();

    var booksSelected = books.filter(function(element) {
        if (element.uri === uri)
            return true;
    });

    if (booksSelected.length > 0) {
        console.log(booksSelected[0]);
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
    if (uri.match('https://itunes.apple')) {
        console.log('mockItunes raised his hand');
        cb(true, 'mockItunes');
    } else {
        cb(false);
    }
};