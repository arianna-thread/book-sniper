'use strict';
var di = require('di'),
    m = new di.Module(),
    injector,
    core,
    config = require('./configCore');

// Configuring dependency injection
m.value('config', config);
m.value('dbLookup', 'http://' + config.modelHost + ':' + config.modelPort + '/books');
m.value('pluginManagerLookup', 'http://' + config.pgmHost + ':' + config.pgmPort + '/books');
m.factory('core', require('./core'));
injector = new di.Injector([m]);

core = injector.get('core');

core.listen(config.restPort, config.restHost, function (err) {
    if (err) {
        console.error('Error while starting core REST server :', err);
        return;
    }
    console.log('Core REST server started.');
    console.log('Listening on port ' + config.restPort);
});
