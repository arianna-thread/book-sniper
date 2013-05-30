//this is the ebay plugin
'use strict';
var rest = require('restler'),
    Q = require('Q'),
    ebayAPIKey = 'nof78b945-a792-4f0e-8376-7a35a0dfbef',
    lookupEbay = 'http://open.api.ebay.com/shopping',
    pluginError = require('./../../../errors/pluginError.js');


var uriParser = function(uri) {
        var uriArray = uri.split('/');
        return uriArray[uriArray.length - 1].match(/\d+/);
    };

var getByKey = function(idResource, idType) {
        var item = {},
            defer = Q.defer();

        rest.get(lookupEbay, {
            query: {
                callname: 'FindHalfProducts',
                responseencoding: 'JSON',
                appid: ebayAPIKey,
                version: '603',
                'ProductID.type': idType,
                'ProductID.Value': idResource
            }
        }).on('success', function(data) {
            data = JSON.parse(data);
            //console.log(data);  
            if (data.TotalProducts === 0) {
                defer.reject(pluginError.factory('invalidISBN'));
                return;
            }

            item = {
                uri: data.ProductSearchURL,
                price: data.Products.Product[0].MinPrice.Value,
                title: data.Products.Product[0].Title,
                author: data.Products.Product[0].ItemSpecifics.NameValueList[1].Value,
                isbn: data.Products.Product[0].ProductID[2].Value
            };

            defer.resolve(item);
        }).on('fail', function() {
            defer.reject(pluginError.factory('invalidISBN'));
        });
        return defer.promise;
    };


var getByURI = function(uri) {
        return getByKey(uriParser(uri), 'Reference');
    };

var getByISBN = function(isbn) {
        if (isbn.length !== 13) {
            defer.reject(pluginError.factory('invalidISBN'));
            return;
        }
        return getByKey(isbn, 'ISBN');
    };

exports['getByISBN'] = getByISBN;
exports['getByURI'] = getByURI;

/*
getByISBN('9780451524935').then(function(data) {
    console.log(data);
});

getByURI('http://product.half.ebay.com/1984-by-George-Orwell-1950-Paperback-Anniversary/372689&tg=info').then(function(data) {
    console.log(data);
});
*/