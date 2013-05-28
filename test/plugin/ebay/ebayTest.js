var ebayPlugin = require('../../../plugins/lib/ebay/ebay.js');
var ebayLookup = "http://product.half.ebay.com/1984-by-George-Orwell-1950-Paperback-Anniversary/372689&tg=info";
var ebayLookupInvalid = "http://product.half.ebay.com/1984-by-George-Orwell-1950-Paperback-Anniversary/37268900000&tg=info";


exports['getByISBN'] = function(test) {
    test.expect(1);
    ebayPlugin.getByISBN('9780451524935').then(function(data) {
        test.equal(data.price, 0.76);
        test.done();
    }).fail(function() {
        test.equal(1, 0.75);
        test.done();
    });
};

exports['invalidISBN'] = function(test) {
    test.expect(1);
    ebayPlugin.getByISBN('9780451524935').then(function(data) {
        test.equal(1, 0);
        test.done();
    }).fail(function() {
        test.equal(data.code, 1);
        test.done();
    });
};

exports['getByURI'] = function(test) {
    test.expect(1);
    ebayPlugin.getByURI(ebayLookup).then(function(data) {
        test.equal(data.price, 0.76);
        test.done();
    }).fail(function() {
        test.equal(1, 0.75);
        test.done();
    });
};

exports['invalidURI'] = function(test) {
    test.expect(1);
    ebayPlugin.getByURI(ebayLookupInvalid).then(function(data) {
        test.equal(0, 1);
        test.done();
    }).fail(function(data) {
        test.equal(data.code, 1);
        test.done();
    });
};