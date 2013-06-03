'use strict';
var events = require('events'),
    Q = require('q'),
    plugins = {},
    pluginsNumber = 0;

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
        var noAnswer = 0;
        this.emit('findOwner', uri, function(raised, string) {
            var items = [],
                date = new Date(),
                promises = [];
            if (!raised) {
                noAnswer++;
                if (noAnswer === pluginsNumber) {
                    defer.reject();
                    noAnswer = 0;
                }

            } else {

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
                            items.push(promise.valueOf());
                        }
                    });
                }).fin(function() {
                    defer.resolve(items);
                });
            }
        });

    };
}


Manager.prototype = events.EventEmitter.prototype;

var manager = new Manager();


module.exports = function(pluginsConfiguration) {
    var callba
    Object.keys(pluginsConfiguration).forEach(function(el) {
        plugins[el] = require(pluginsConfiguration[el].path);
        pluginsNumber += 1;
    });


    Object.keys(plugins).forEach(function(el) {
        manager.on('findOwner', plugins[el].raiseHand);
    });

    return {
        getItems: function(uri) {
            var defer = Q.defer();
            manager.findOwner(uri, defer);
            return defer.promise;
        }
    };
};