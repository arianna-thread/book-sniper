'use strict';
var OperationHelper = require('apac').OperationHelper,
    Q = require('Q'),
    pluginError = require('./../../../errors/pluginError.js');

// var opHelper = new OperationHelper({
//     awsId: 'AKIAJIM5WYAJLUU32ZRQ',
//     awsSecret: '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',
//     assocId: '6df06f5e8d6c5d3bf588a432c52fdc69cfc1c88b5f9d2d6636332c9a5eab3e09'
// });

function uriParser(uri) {

    return uri.split('/')[5];
}




var getByISBN = function(isbn) {
    var opHelper = new OperationHelper({
        awsId: 'AKIAJIM5WYAJLUU32ZRQ',
        awsSecret: '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',
        assocId: '6df06f5e8d6c5d3bf588a432c52fdc69cfc1c88b5f9d2d6636332c9a5eab3e09'
    });
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

exports.getByISBN = getByISBN;
