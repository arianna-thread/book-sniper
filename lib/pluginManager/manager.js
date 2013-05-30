'use strict';
var events = require('events'),
    itunes = require('plugins/itunes/itunes.js')

    function Manager() {
        events.EventEmitter.call(this);
        this.findOwner = function(uri) {
            this.emit('findOwner', uri);
        };
        this.print = function(string) {
            console.log(string);
        };
    }

Manager.prototype = events.EventEmitter.prototype;

var frontDoor = new Door('brown');
frontDoor.on('findOwner', );
frontDoor.open();