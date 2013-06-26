(function() {
  var sendResponse;

  module.exports = function(modelManager, books) {
    var app, express;
    express = require('express');
    app = express();
    app.configure(function() {
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      return app.use(app.router);
    });
    app.get('/books', function(req, res) {
      var promise, query, uri, urlParams;
      urlParams = req.query;
      query = urlParams.query;
      uri = urlParams.uri;
      promise = null;
      if (uri) {
        promise = modelManager.searchByUri(uri);
      } else if (query) {
        promise = modelManager.fullTextQuery(query);
      } else {
        promise = books.getAll();
      }
      return promise.then(function(data) {
        return sendResponse(data, res);
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/: " + (JSON.stringify(err)));
      });
    });
    app.get('/isbns', function(req, res) {
      return modelManager.getISBNs().then(function(data) {
        return sendResponse(data, res);
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/: " + (JSON.stringify(err)));
      });
    });
    app.post('/books', function(req, res) {
      var book;
      book = req.body;
      return modelManager.createBook(book).then(function(data) {
        return sendResponse(data, res);
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/: " + (JSON.stringify(err)));
      });
    });
    app.get('/books/:isbn', function(req, res) {
      var isbn;
      isbn = req.params.isbn;
      return modelManager.getByISBN(isbn).then(function(data) {
        return sendResponse(data, res);
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/" + isbn + ": " + (JSON.stringify(err)));
      });
    });
    app.put('/books/:isbn', function(req, res) {
      var book;
      book = req.body;
      return books.replace(book).then(function(data) {
        return sendResponse(data, res);
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/" + isbn + ": " + (JSON.stringify(err)));
      });
    });
    app.get('/books/:isbn/refs', function(req, res) {
      var isbn;
      isbn = req.params.isbn;
      return modelManager.getByISBN(isbn).then(function(data) {
        if (data.code) {
          return res.status(data.code).json(data);
        } else {
          return res.json(data.refs);
        }
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/" + isbn + "/refs: " + (JSON.stringify(err)));
      });
    });
    app.post('/books/:isbn/refs', function(req, res) {
      var isbn, prices;
      isbn = req.params.isbn;
      prices = req.body;
      return modelManager.addPrices(isbn, prices).then(function(data) {
        return sendResponse(data, res);
      }, function(data) {
        return sendResponse(data, res);
      }).fail(function(err) {
        return console.error("Error while processing request on /books/" + isbn + "/refs: " + (JSON.stringify(err)));
      });
    });
    return app;
  };

  sendResponse = function(data, res) {
    if (data.code) {
      return res.status(data.code).json(data);
    } else {
      return res.json(data);
    }
  };

}).call(this);
