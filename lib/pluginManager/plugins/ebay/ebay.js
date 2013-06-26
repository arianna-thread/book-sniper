//this is the ebay plugin
'use strict';
var rest = require('restler'),
    Q = require('q'),
    ebayAPIKey, lookupEbay = 'http://open.api.ebay.com/shopping',
    pluginError = require('../../../../errors/pluginError.js');

try {
    ebayAPIKey = require('../../secrets.json').ebay.key;
} catch (e) {
    console.log('Ebay key not provided');
}


var uriParser = function(uri) {
    var uriArray = uri.split('/');
    var id = uriArray[uriArray.length - 1].match(/pr=\d+/);
    id = (id) ? id[0].substring(3) : uriArray[uriArray.length - 1].match(/\d+/);
    // console.log(uri + " " + id);
    return id;
};

var getByKey = function(idResource, idType) {
    var item = {},
        defer = Q.defer();

    if (!idResource) {
        defer.reject(pluginError.factory((idType === 'ISBN') ? 'invalidISBN' : 'invalidURI'));
    } else {
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
            if (data.Ack !== 'Success') {
                console.error('Request to ebay error');
                defer.reject(pluginError.factory((idType === 'ISBN') ? 'invalidISBN' : 'invalidURI'));
                return;
            }
            try {
                item = {
                    uri: data.ProductSearchURL,
                    price: data.Products.Product[0].MinPrice.Value,
                    title: data.Products.Product[0].Title,
                    author: data.Products.Product[0].ItemSpecifics.NameValueList[1].Value.join(", "),
                    isbn: data.Products.Product[0].ProductID[2].Value,
                    source: 'ebay'
                };
            } catch (e) {
                defer.reject(pluginError.factory((idType === 'ISBN') ? 'invalidISBN' : 'invalidURI'));
            }

            defer.resolve(item);
        }).on('fail', function() {
            defer.reject(pluginError.factory((idType === 'ISBN') ? 'invalidISBN' : 'invalidURI'));
        });
    }
    return defer.promise;
};


var getByURI = function(uri) {
    return getByKey(uriParser(uri), 'Reference');
};

var getByISBN = function(isbn) {
    return getByKey(isbn, 'ISBN');
};

exports['getByISBN'] = getByISBN;
exports['getByURI'] = getByURI;

exports['raiseHand'] = function(uri, cb) {
    if (uri.match('product.half.ebay')) {
        cb(true, 'ebay');
    } else {
        cb(false);
    }
};


/*
getByISBN('9780451524935').then(function(data) {
    console.log(data);
});

getByURI('http://product.half.ebay.com/1984-by-George-Orwell-1950-Paperback-Anniversary/372689&tg=info').then(function(data) {
    console.log(data);
});
*/
