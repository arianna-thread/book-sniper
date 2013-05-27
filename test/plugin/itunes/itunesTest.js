var itunesPlugin = require('../../../plugins/lib/itunes/itunes.js');
var itunesLookup = 'https://itunes.apple.com/us/book/steve-jobs/id431617578?mt=11';


exports['getByURI'] = function(test) {
    test.expect(1);
    itunesPlugin.getByURI(itunesLookup).then(function(data) {
        console.log(data);
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
        console.log(data);
        test.equal(data.price, 7.99);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};