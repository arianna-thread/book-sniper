'use strict';
var db = require('../models/bootstrapModel.js');
var pgm = require('../../test/plugins/pluginManager/boostrap.js');

var di = require('di');
var m = new di.Module();

m.value('dbLookup', 'http://localhost:8080/books');
m.value('pluginManagerLookup', 'http://localhost:3000/books');
m.value('config', require('./config'));
m.factory('core', require('./core'));

var injector = new di.Injector([m]);
var core = injector.get('core');
var config = injector.get('config');

core.listen(config.restPort, config.restHost, function(err) {
    if (err) {
        console.error('Error while starting core REST server :' + err);
        return;
    }
    console.log('Core REST server started.');
    return console.log('Listening on port ' + config.restPort);
});
