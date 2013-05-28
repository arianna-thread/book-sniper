var itunesPlugin = require('../../../plugins/lib/itunes/itunes.js');
var itunesLookup = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11';
var invaliditunesLookup = 'https://itunes.apple.com/us/book/steve-jobs/id4316asd17578?mt=11';


exports['getByURI'] = function(test) {
    test.expect(1);
    itunesPlugin.getByURI(itunesLookup).then(function(data) {
        test.equal(data.price, 16.99);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};

exports['getByISBN'] = function(test) {
    test.expect(1);
    itunesPlugin.getByISBN('9780316069359').then(function(data) {
        test.equal(data.price, 7.99);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};

exports['invalidURI'] = function(test) {
    test.expect(1);
    itunesPlugin.getByURI(invaliditunesLookup).then(function(data) {
        test.equal(0, 1);
        test.done();
    }).fail(function(data) {
        console.log('asd');
        test.equal(data.code, 1);
        test.done();
    });
};


exports['invalidISBN'] = function(test) {
    test.expect(1);
    itunesPlugin.getByISBN(9780317899876069359).then(function(data) {
        test.equal(0, 1);
        test.done();
    }).fail(function(data) {
        test.equal(data.code, 0);
        test.done();
    });
};