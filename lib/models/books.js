(function() {
  var Q, booksFactory, validISBN;

  Q = require('q');

  validISBN = function(ISBN) {
    return (typeof ISBN) === 'string' && (ISBN != null ? ISBN.length : void 0) === 13;
  };

  booksFactory = function(baseModel, errors) {
    var books;
    books = Object.create(baseModel);
    books.getAll = function(filter, limit) {
      if (filter == null) {
        filter = {};
      }
      return this._getAll('books', filter, limit);
    };
    books.getByUri = function(uri) {
      var filter;
      if (typeof uri !== 'string') {
        return Q.reject("Expected " + uri + " to be a string");
      }
      filter = {
        'refs.uri': uri
      };
      return this.getAll(filter).then(function(books) {
        if (books.length > 1) {
          throw errors.CONSISTENCY_ERROR_URI;
        }
        if (books.length === 1) {
          return books[0];
        }
        return null;
      });
    };
    books.getByISBN = function(ISBN) {
      var filter;
      if (!validISBN(ISBN)) {
        return Q.reject(errors.INVALID_ISBN);
      }
      filter = {
        isbn: ISBN
      };
      return this.getAll(filter).then(function(books) {
        if (books.length > 1) {
          throw errors.CONSISTENCY_ERROR_ISBN;
        }
        if (books.length === 1) {
          return books[0];
        }
        return null;
      });
    };
    books.create = function(book) {
      var ISBN;
      ISBN = book != null ? book.isbn : void 0;
      if (!validISBN(ISBN)) {
        return Q.reject(errors.INVALID_ISBN);
      }
      return this._insert('books', book);
    };
    books.replace = function(book) {
      var ISBN;
      ISBN = book != null ? book.isbn : void 0;
      if (!validISBN(ISBN)) {
        return Q.reject(errors.INVALID_ISBN);
      }
      return this._replace('books', book);
    };
    books.query = function(queryString) {
      var filter, matcher;
      if ((typeof queryString) !== "string") {
        return Q.reject(errors.INVALID_QUERY);
      }
      matcher = new RegExp(queryString);
      filter = {
        $or: [
          {
            isbn: {
              $regex: matcher
            }
          }, {
            title: {
              $regex: matcher
            }
          }, {
            author: {
              $regex: matcher
            }
          }
        ]
      };
      return this.getAll(filter);
    };
    books.addPrices = function(ISBN, prices) {
      var filter, update;
      if (!validISBN(ISBN)) {
        return Q.reject(errors.INVALID_ISBN);
      }
      if (!Array.isArray(prices)) {
        prices = [prices];
      }
      filter = {
        isbn: ISBN
      };
      update = {
        $pushAll: {
          refs: prices
        }
      };
      return this._update('books', filter, update, false);
    };
    return books;
  };

  module.exports = booksFactory;

}).call(this);
