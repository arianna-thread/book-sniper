'use strict';
var express = require('express'),
    app = express();

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});
app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/items/:uri', function(req, res) {
    res.send('hello world');
});


app.listen(3000);