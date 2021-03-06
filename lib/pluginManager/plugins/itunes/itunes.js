//this is the itunes plugin
'use strict';
var rest = require('restler'),
    Q = require('q'),
    lookupItunes = 'https://itunes.apple.com/lookup',
    lookupGoogle = 'https://www.googleapis.com/books/v1/volumes',
    googleAPIKey,
    pluginError = require('./../../../../errors/pluginError.js');

try {
    googleAPIKey = require('../../secrets.json').google.key;
} catch (e) {
    console.log('Google key not provided in itunes Plugin');
}


function uriParser(uri) {
    var uriArray = uri.split('/');
    if (uriArray.length > 1 && uriArray[uriArray.length - 1].match(/id\d+/) !== null) {
        return uriArray[uriArray.length - 1].match(/id\d+/)[0].substring(2);
    }
}

exports['getByURI'] = function(uri) {
    var defer = Q.defer(),
        idResource = uriParser(uri),
        item = {};

    if (!idResource) {
        defer.reject(pluginError.factory('invalidURI'));
    }
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
        item.source = 'itunes';
        rest.get(lookupGoogle, {
            query: {
                q: 'intitle:' + item.title + '+inauthor:' + item.author,
                key: googleAPIKey
            }
        }).on("success", function(data) {

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
        item.source = 'itunes';
        defer.resolve(item);
    }).on('fail', function() {
        defer.reject(pluginError.factory('invalidISBN'));
    });
    return defer.promise;

};

exports['raiseHand'] = function(uri, cb) {

    if (uri.match('itunes.apple')) {
        cb(true, 'itunes');
    } else {
        cb(false);
    }
};