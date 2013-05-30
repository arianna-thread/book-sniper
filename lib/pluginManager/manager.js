'use strict';
var events = require('events');

function Manager() {
	events.EventEmitter.call(this);
	this.findOwner = function(uri) {
		this.emit('findOwner', uri);
	};
}

Manager.prototype = events.EventEmitter.prototype;

var frontDoor = new Door('brown');
frontDoor.on('open', function() {
	console.log('ring ring ring');
});
frontDoor.open();