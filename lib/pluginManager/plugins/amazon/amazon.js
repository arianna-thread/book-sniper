'use strict';
var OperationHelper = require('apac').OperationHelper,
    Q = require('q'),
    pluginError = require('../../../../errors/pluginError.js'),
    amazonSecret;

try {
    amazonSecret = require('../../secrets.json').amazon;
} catch (e) {
    console.log('Invalid secrets json');
}

function uriParser(uri) {

    return uri.split('/')[5];
}



var getByISBN = function(isbn) {
    var opHelper = new OperationHelper(amazonSecret);
    var defer = Q.defer();
    var item;
    opHelper.execute('ItemLookup', {
        'SearchIndex': 'Books',
        'ItemId': isbn,
        'IdType': 'ISBN',
        'ResponseGroup': 'Medium'
    }, function(error, results) {
        if (results.ItemLookupResponse.Items[0].Request[0].Errors) {
            defer.resolve(pluginError.factory('invalidISBN'));
            return;
        }

        item = {
            uri: results.ItemLookupResponse.Items[0].Item[0].DetailPageURL,
            author: results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Author[0],
            title: results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
            ISBN: results.ItemLookupResponse.Items[0].Request[0].ItemLookupRequest[0].ItemId[0],
            price: results.ItemLookupResponse.Items[0].Item[0].OfferSummary[0].LowestNewPrice[0].Amount / 100
        };
        defer.resolve(item);
    });
    return defer.promise;
};


exports.getByURI = function(uri) {
    var idResource = uriParser(uri);
    return getByISBN(idResource);
};

exports['raiseHand'] = function(uri, cb) {
    if (uri.match('http://www.amazon')) {
        cb('amazon');
    }
};

exports.getByISBN = getByISBN;