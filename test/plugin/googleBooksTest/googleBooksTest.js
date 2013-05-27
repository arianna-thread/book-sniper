var googlePlugin = require('../../../plugins/lib/googleBooks/googleBooks.js');
var googleLookup = 'http://books.google.fr/books?id=swsZuHxsJDwC&printsec=frontcover&dq=isbn:9782709638821&hl=&cd=1&source=gbs_api';
exports['getByURI'] = function(test) {
    test.expect(1);
    googlePlugin.getByURI(googleLookup).then(function(data) {
        test.equal(data.price, 10.99);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};
exports['getByISBN'] = function(test) {
    test.expect(1);
    googlePlugin.getByISBN('9782709638821').then(function(data) {
        test.equal(data.price, 10.99);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};

exports['invalidISBN'] = function(test) {
    test.expect(1);
    googlePlugin.getByISBN('9782709623232312312438821').then(function(data) {
        test.equal(1, 0);
        test.done();
    }).fail(function() {
        test.equal(1, 1);
        test.done();
    });
};