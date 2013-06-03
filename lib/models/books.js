(function() {
  var Q, booksFactory;

  Q = require('q');

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
      if ((typeof ISBN) !== 'string' || ISBN.length !== 13) {
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
      if ((typeof ISBN) !== 'string' || ISBN.length !== 13) {
        return Q.reject(errors.INVALID_ISBN);
      }
      return this._insert('books', book);
    };
    return books;
  };

  module.exports = booksFactory;

}).call(this);
