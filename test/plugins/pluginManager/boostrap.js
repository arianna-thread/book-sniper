'use strict';

var di = require('di');
var m = new di.Module();

var config2 = {
	mockAmazon: {
		'path': __dirname + '/../mocks/mockAmazon'
	},
	mockItunes: {
		'path': __dirname + '/../mocks/mockItunes'
	},
	mockGoogle: {
		'path': __dirname + '/../mocks/mockGoogle'
	}
};
m.value('pluginsConfiguration', config2);
m.factory('manager', require('../../../lib/pluginManager/manager.js'));
m.factory('managerServer', require('../../../lib/pluginManager/pluginManager.js'));

var injector = new di.Injector([m]);
var managerServer = injector.get('managerServer');

managerServer.listen(3000);
console.log('i m listening on port 3000');