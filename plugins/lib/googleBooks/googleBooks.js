'use strict';
var rest = require('restler');
var Q = require('Q');
var googleAPIKey = 'AIzaSyCsdnr6l5YAdGIXZSMCjHJ9V4hq67ypc64';
var lookupGoogle = 'https://www.googleapis.com/books/v1/volumes';

function uriParser(uri) {
	var string = uri.match(/id=(.*?)[&]/)[0];
	return string.substring(3, string.length - 1);
}

function createObject(data, defer) {
	var item;
	if (data.totalItems === 0) {
		console.log('0 items');
		defer.reject({
			error: 'invalidISBN'
		});
		return;
	}
	if (data.items[0].saleInfo.saleability === 'NOT_FOR_SALE') {
		console.log('not in sale');
		defer.reject({
			error: 'notForSale'
		});
		return;
	}

	item = {
		uri: data.items[0].volumeInfo.previewLink,
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

exports['getByURI'] = function(uri) {
	var idResource = uriParser(uri),
		item,
		defer = Q.defer();
	rest.get(lookupGoogle + '/' + idResource).on('success', function(data) {
		if (data.error) {
			defer.reject({
				error: 'invalidURI'
			});
			return;
		}

		if (data.saleInfo.saleability === 'NOT_FOR_SALE') {
			console.log('not in sale');
			defer.reject({
				error: 'notForSale'
			});
			return;
		}

		item = {
			uri: data.volumeInfo.previewLink,
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
		defer.reject({
			error: 'failURIGoogleBooks'
		});
	});
	return defer.promise;
};



exports['getByISBN'] = function(isbn) {
	var defer = Q.defer();
	rest.get(lookupGoogle, {
		query: {
			q: 'isbn:' + isbn,
			key: googleAPIKey
		}
	}).on('success', function(data) {
		createObject(data, defer);
	}).on('fail', function(data) {
		defer.reject({
			error: 'failISBNGoogleBooks'
		});
	});
	return defer.promise;
};