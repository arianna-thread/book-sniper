'use strict';
var OperationHelper = require('apac').OperationHelper,
    Q = require('q'),
    pluginError = require('../../../../errors/pluginError.js'),
    amazonSecret;

try {
    amazonSecret = require('../../secrets.json').amazon;
} catch (e) {
    console.error('Amazon secret required but not specified');
}

function uriParser(uri) {
    var split = uri.split('/');
    if (split && split.length > 5)
        return split[5];
}



var retrieveByISBN = function(isbn, type) {
    var opHelper = new OperationHelper(amazonSecret);
    var defer = Q.defer();
    var item, uri;
    opHelper.execute('ItemLookup', {
        'SearchIndex': 'Books',
        'ItemId': isbn,
        // 'IdType': 'EAN',
        'IdType': 'ISBN',
        'ResponseGroup': 'Medium'
    }, function(error, results) {

        if (error || results.ItemLookupResponse.Items[0].Request[0].Errors || isbn === undefined) {
            if (type === 'ISBN')
                defer.reject(pluginError.factory('invalidISBN'));
            else
                defer.reject(pluginError.factory('invalidURI'));
            return;
        }
        try {
            if (Array.isArray(results.ItemLookupResponse.Items[0].Item[0].DetailPageURL)) {
                uri = results.ItemLookupResponse.Items[0].Item[0].DetailPageURL[0];
            } else {
                uri = results.ItemLookupResponse.Items[0].Item[0].DetailPageURL;
            }
            // console.log();
            item = {
                uri: uri,
                author: results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0],
                title: results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
                // isbn: results.ItemLookupResponse.Items[0].Request[0].ItemLookupRequest[0].ItemId[0],
                isbn: results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].EAN[0],
                price: results.ItemLookupResponse.Items[0].Item[0].OfferSummary[0].LowestNewPrice[0].Amount / 100,
                source: 'amazon'
            };
        } catch (e) {
            defer.reject(pluginError.factory('invalidISBN'));
        }
        defer.resolve(item);
    });
    return defer.promise;
};


exports.getByURI = function(uri) {
    var idResource = uriParser(uri);
    return retrieveByISBN(idResource, 'URI');
};

exports['raiseHand'] = function(uri, cb) {
    if (uri.match('www.amazon.com')) {
        cb(true, 'amazon');
    } else {
        cb(false);
    }
};

exports.getByISBN = function(isbn) {
    return retrieveByISBN(isbn, 'ISBN');
};
