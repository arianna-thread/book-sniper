'use strict';
module.exports = function(manager, configurationPath) {
    var express = require('express'),
        app = express(),
        fs = require('fs');

    app.configure(function() {
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
    });
    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.get('/books', function(req, res) {

        manager.getBooks(req.query.uri).then(function(data) {
            res.json(data);
        }).fail(function() {
            res.json({
                error: 'badURI'
            });
        });

    });

    app.get('/prices', function(req, res) {
        console.log(req.query.isbns);
        try {
            manager.updatePrices(JSON.parse(req.query.isbns)).then(function(data) {
                res.json(data);
            }).fail(function() {
                res.json({
                    error: 'failed to update prices'
                });

            });
        } catch (e) {
            res.json({
                error: 'invalidArray'
            });
        }

    });

    console.log(configurationPath);
    var configuration;
    fs.watch(configurationPath, function(curr, prev) {
        fs.readFile(configurationPath, 'utf8', function(err, data) {
            try {
                configuration = JSON.parse(data);
                console.log('mi sto rilodando');

            } catch (e) {
                console.log('Invalid configuration file');
            }
            manager.reloadModule(configuration);

        });
    });

    return app;
};