'use strict';

var rest = require('restler'),
	Q = require('q'),
	lookupGoogle = 'https://www.googleapis.com/books/v1/volumes',
	pluginError = require('../../../../errors/pluginError.js');


function uriParser(uri) {
	var string = uri.match(/id=([^&]*)/);
	if (string && string[1])
		return string[1];

}


exports['getByURI'] = function(uri) {
	var idResource = uriParser(uri),
		item,
		defer = Q.defer();
	if (!idResource)
		defer.reject(pluginError.factory('invalidURI'));
	rest.get(lookupGoogle + '/' + idResource).on('success', function(data) {
		if (data.error) {
			defer.reject(pluginError.factory('invalidURI'));
			return;
		}

		if (data.saleInfo.saleability === 'NOT_FOR_SALE') {
			console.log('not in sale');
			defer.reject(pluginError.factory('notAvaialable'));
			return;
		}

		item = {
			uri: data.volumeInfo.canonicalVolumeLink,
			price: data.saleInfo.retailPrice.amount,
			title: data.volumeInfo.title,
			author: data.volumeInfo.authors[0]
		};



		data.volumeInfo.industryIdentifiers.forEach(function(el) {
			if (el.type === 'ISBN_13') {
				item.isbn = el.identifier;
			}
		});
		defer.resolve(item);


	}).on('fail', function(data) {
		defer.reject(pluginError.factory('invalidURI'));
	});
	return defer.promise;
};



function createObject(data, defer) {
	var item;
	if (data.totalItems === 0) {
		defer.reject(pluginError.factory('invalidISBN'));
		return;
	}
	if (data.items[0].saleInfo.saleability === 'NOT_FOR_SALE') {
		console.log('not in sale');
		defer.reject(pluginError.factory('notAvaialable'));
		return;
	}
	item = {
		uri: data.items[0].volumeInfo.canonicalVolumeLink,
		price: data.items[0].saleInfo.retailPrice.amount,
		title: data.items[0].volumeInfo.title,
		author: data.items[0].volumeInfo.authors[0]
	};



	data.items[0].volumeInfo.industryIdentifiers.forEach(function(el) {
		if (el.type === 'ISBN_13') {
			item.isbn = el.identifier;
		}
	});
	defer.resolve(item);
}

exports['getByISBN'] = function(isbn) {
	var defer = Q.defer();
	rest.get(lookupGoogle, {
		query: {
			q: 'isbn:' + isbn
		}
	}).on('success', function(data) {
		createObject(data, defer);
	}).on('fail', function(data) {
		defer.reject(pluginError.factory('invalidISBN'));
	});
	return defer.promise;
};


exports['raiseHand'] = function(uri, cb) {
	if (uri.match('http://books.google')) {
		cb(true, 'googleBooks');
	} else {
		cb(false);
	}
};
