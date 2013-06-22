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

var loadModule = function(conf) {
    Object.keys(conf).forEach(function(el) {
        plugins[el] = require(conf[el].path);
        pluginsNumber += 1;
    });


    Object.keys(plugins).forEach(function(el) {
        manager.on('findOwner', plugins[el].raiseHand);
    });

};

module.exports = function(pluginsConfiguration) {
    loadModule(pluginsConfiguration);
    return {
        reloadModule: loadModule,
        getBooks: function(uri) {
            var defer = Q.defer();
            manager.findOwner(uri, defer);
            return defer.promise;
        },
        updatePrices: function(ISBNarray) {
            var newPrices = [],
                date = new Date(),
                defer = Q.defer(),
                booksPromises = [];
            ISBNarray.forEach(function(isbn, index) {
                var promisesArray = [];
                newPrices[index] = {
                    isbn: isbn,
                    refs: []
                };
                Object.keys(plugins).forEach(function(el) {
                    promisesArray.push(plugins[el].getByISBN(isbn));
                });

                booksPromises[index] = Q.allResolved(promisesArray).then(function(results) {

                    results.forEach(function(result) {
                        // console.log(result.valueOf().source, result.valueOf().price, result.state);
                        if (result.isFulfilled()) {

                            newPrices[index].refs.push({
                                date: date,
                                source: result.valueOf().source,
                                price: result.valueOf().price
                            });

                        }
                    });

                });

            });
            Q.allResolved(booksPromises).then(function() {
                defer.resolve(newPrices);
            });
            return defer.promise;
        }

    };
};