'use strict';
var express = require('express'),
    app = express(),
    manager = require('./manager'),
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

app.get('/books/', function(req, res) {

    manager.getBooks(function(data) {
        res.json(JSON.parse(data));
    }).fail(function() {
        res.json({
            error: 'badURI'
        });
    });

});

app.get('/prices/', function(req, res) {
    manager.updatePrices(function(data) {
        res.json(JSON.parse(data));
    }).fail(function() {
        res.json({
            error: 'failed to update prices'
        });

    });

});

fs.watch('pluginConfig.json', function(curr, prev) {
    fs.readFile('pluginConfig.json', function(err, data) {
        try {
            var configuration = JSON.parse(data);
            manager.reloadModule(configuration);
        } catch (e) {
            console.log('Invalid configuration file');
        }
    });
});

app.listen(3000);