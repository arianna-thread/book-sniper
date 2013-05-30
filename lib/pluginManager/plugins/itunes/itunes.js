//this is the itunes plugin
'use strict';
var rest = require('restler'),
    Q = require('Q'),
    googleAPIKey = 'AIzaSyCsdnr6l5YAdGIXZSMCjHJ9V4hq67ypc64',
    lookupItunes = 'https://itunes.apple.com/lookup',
    lookupGoogle = 'https://www.googleapis.com/books/v1/volumes',
    pluginError = require('./../../../../errors/pluginError.js');

try {
    googleAPIKey = require('../../secrets').googleBooks.key;
    console.log(googleAPIKey);
} catch (e) {
    console.log('Invalid secrets json');
}

function uriParser(uri) {
    var uriArray = uri.split('/');
    return uriArray[uriArray.length - 1].match(/id\d+/)[0].substring(2);
}

exports['getByURI'] = function(uri) {
    console.log('cristodioputtana', uri);


    var defer = Q.defer(),
        idResource = uriParser(uri),
        item = {};
    rest.get(lookupItunes, {
        query: {
            id: idResource
        }
    }).on('success', function(data) {
        data = JSON.parse(data);
        if (data.resultCount === 0) {
            defer.reject(pluginError.factory('invalidURI'));
            return;
        }
        item.uri = uri;
        item.price = data.results[0].price;
        item.title = data.results[0].trackCensoredName;
        item.author = data.results[0].artistName;
        // console.log(item);
        rest.get(lookupGoogle, {
            query: {
                q: 'intitle:' + item.title + '+inauthor:' + item.author,
                key: googleAPIKey
            }
        }).on("success", function(data) {
            // console.log(data);
            if (data.totalItems === 0) {
                defer.reject(pluginError.factory('invalidURI'));
                return;
            }
            data.items[0].volumeInfo.industryIdentifiers.forEach(function(el) {
                if (el.type === 'ISBN_13') {
                    item.isbn = el.identifier;
                }
            });
            defer.resolve(item);

        }).on('fail', function(data) {
            defer.reject(pluginError.factory('invalidURI'));
        });

    }).on('fail', function(data) {
        defer.reject(pluginError.factory('invalidURI'));

    });
    return defer.promise;
};


exports['getByISBN'] = function(isbn) {
    var item = {},
        defer = Q.defer();

    rest.get(lookupItunes, {
        query: {
            isbn: isbn
        }
    }).on('success', function(data) {
        data = JSON.parse(data);
        if (data.resultCount === 0) {
            defer.reject(pluginError.factory('invalidISBN'));
            return;
        }

        item.uri = data.results[0].trackViewUrl;
        item.price = data.results[0].price;
        item.title = data.results[0].trackCensoredName;
        item.author = data.results[0].artistName;
        item.isbn = isbn;
        defer.resolve(item);
    }).on('fail', function() {
        defer.reject(pluginError.factory('invalidISBN'));
    });
    return defer.promise;

};