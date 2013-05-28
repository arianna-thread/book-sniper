plugin = require('../../../plugins/lib/amazon/amazon.js');
var lookup = 'http://www.amazon.com/gp/product/1579654924/ref=s9_al_bw_g14_ir04?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-3&pf_rd_r=189D4777EEA342BC85AF&pf_rd_t=101&pf_rd_p=1546559002&pf_rd_i=390919011';


exports['getByURI'] = function(test) {
    test.expect(1);
    plugin.getByURI(lookup).then(function(data) {
        test.equal(data.price, 17.99);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};

exports['getByISBN'] = function(test) {
    test.expect(1);
    plugin.getByISBN('9781455501663').then(function(data) {
        console.log(data);
        test.equal(data.price, 11.49);
        test.done();
    }).fail(function() {
        test.equal(1, 16.99);
        test.done();
    });
};