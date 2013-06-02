'use strict';
var events = require('events'),
    pluginsConfiguration,
    Q = require('q'),
    plugins = {};
try {
    pluginsConfiguration = require('./pluginConfig.json');
} catch (e) {
    console.log('Invalid configuration file ');
}

Object.keys(pluginsConfiguration).forEach(function(el) {
    plugins[el] = require(pluginsConfiguration[el].path);
});


var once = function(fn) {

    var alreadyCalled = false;

    return function() {
        if (alreadyCalled) {
            return (function() {}());
        }
        fn.apply(null, arguments);
        alreadyCalled = true;
    };
};



function Manager() {
    events.EventEmitter.call(this);
    this.name = 'manager';
    var myUri;
    this.findOwner = function(uri) {
        myUri = uri;
        this.emit('findOwner', uri, findItems);
    };
    var findItems = function(string) {
        var items = [];
        var date = new Date();
        var promises = [];
        console.log(string, myUri);

        var queriePlugins = plugins[string].getByURI(myUri).then(function(data) {
            data.date = date;
            items.push(data);
            Object.keys(plugins).forEach(function(el) {
                if (el !== string) {
                    promises.push(plugins[el].getByISBN(data.isbn));
                }
            });
            console.log('success', JSON.stringify(data));

            return Q.allResolved(promises);
        })
            .fail(function(data) {
            console.log('fail');
            if (data.code < 2) {
                throw new Error();
            } else {
                data.date = date;
                items.push(data);
            }
        });

        queriePlugins.then(function(promise) {
            console.log('fulfilled', JSON.stringify(promise.isFulfilled));
            if (promise.isFulfilled()) {
                var value = promise.valueOf();
                console.log(JSON.stringify(value));
            } else {
                var exception = promise.valueOf().exception;
            }
        });

    };
}

Manager.prototype = events.EventEmitter.prototype;



var manager = new Manager();
Object.keys(plugins).forEach(function(el) {
    manager.on('findOwner', plugins[el].raiseHand);
});



exports['returnItems'] = function(uri) {
    manager.findOwner(uri);

    return manager.findItems;
}