'use strict';
var events = require('events'),
    pluginsConfiguration,
    Q = require('q'),
    plugins = {},
    pluginsNumber = 0;
try {
    pluginsConfiguration = require('./pluginConfig.json');
} catch (e) {
    console.log('Invalid configuration file ');
}

Object.keys(pluginsConfiguration).forEach(function(el) {
    plugins[el] = require(pluginsConfiguration[el].path);
    pluginsNumber += 1;
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
    this.findOwner = function(uri, defer) {
        var myUri = uri;
        this.emit('findOwner', uri, function(string) {
            var items = [],
                date = new Date(),
                promises = [];

            var queriesPlugins = plugins[string].getByURI(myUri).then(function(data) {
                data.date = date;
                items.push(data);
                Object.keys(plugins).forEach(function(el) {
                    if (el !== string) {
                        promises.push(plugins[el].getByISBN(data.isbn));
                    }
                });
                return Q.allResolved(promises);
            })
                .fail(function(data) {
                // console.log('fail');
                if (data.code < 2) {
                    defer.reject();
                    return;
                } else {
                    data.date = date;
                    items.push(data);
                }
            });


            queriesPlugins.then(function(promises) {

                promises.forEach(function(promise) {
                    if (promise.isFulfilled()) {
                        promise.then(function(data) {
                            items.push(data);
                        });
                    } else {
                        // console.log('notFullfilled');
                    }

                    defer.resolve(items);
                });


            }).fail(function() {
                defer.resolve('fail');
            });
        });

    };
}
Manager.prototype = events.EventEmitter.prototype;



var manager = new Manager();
Object.keys(plugins).forEach(function(el) {
    manager.on('findOwner', plugins[el].raiseHand);
});


exports['getItems'] = function(uri) {
    var defer = Q.defer();
    manager.findOwner(uri, defer);
    return defer.promise;
};