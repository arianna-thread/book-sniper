(function() {
  var Q, booksFactory;

  Q = require('q');

  booksFactory = function(baseModel) {
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
          throw "Consistency error, multiple objects found with same uri: " + books;
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
        return Q.reject('ISBN must be a 13-characters string');
      }
      filter = {
        isbn: ISBN
      };
      return this.getAll(filter).then(function(books) {
        if (books.length > 1) {
          throw "Consistency error, multiple objects found with same ISBN: " + books;
        }
        if (books.length === 1) {
          return books[0];
        }
        return null;
      });
    };
    return books;
  };

  module.exports = booksFactory;

}).call(this);
