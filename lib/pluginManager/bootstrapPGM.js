'use strict';
var configurationPath =  __dirname + '/pluginConfig.json',
    di = require('di'),
    m = new di.Module(),
    config = require('./config');



m.value('pluginsConfiguration', require(configurationPath));
m.value('configurationPath', configurationPath);
m.factory('manager', require('./manager.js'));
m.factory('managerServer', require('./pluginManager.js'));

var injector = new di.Injector([m]);
var managerServer = injector.get('managerServer');


managerServer.listen(config.pgmPort || 3000, config.pgmHost || '127.0.0.1', function (err) {
    if (err) {
        console.error('Error while starting plugin manager module:', err);
        return;
    }
    console.log('Plugin manager listening on port 3000');
});
