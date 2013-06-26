(function() {
  var Q, checkBook;

  Q = require('q');

  module.exports = function(books, errors) {
    return {
      searchByUri: function(uri) {
        return books.getByUri(uri).then(function(book) {
          if (book != null) {
            return book;
          } else {
            throw errors.NOT_FOUND;
          }
        });
      },
      getByISBN: function(ISBN) {
        return books.getByISBN(ISBN).then(function(book) {
          if (book != null) {
            return book;
          } else {
            throw errors.NOT_FOUND;
          }
        });
      },
      fullTextQuery: function(query) {
        return books.query(query);
      },
      getISBNs: function() {
        return books.getAll().then(function(books) {
          var book, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = books.length; _i < _len; _i++) {
            book = books[_i];
            _results.push(book.isbn);
          }
          return _results;
        });
      },
      createBook: function(book) {
        if (checkBook(book) === false) {
          return Q.reject(errors.BAD_PARAMETER);
        }
        return books.getByISBN(book.isbn).then(function(oldBook) {
          if (oldBook != null) {
            return oldBook;
          }
          return books.create(book);
        });
      },
      addPrices: function(ISBN, prices) {
        return books.addPrices(ISBN, prices).then(function(count) {
          if (count === 0) {
            throw errors.NOT_FOUND;
          } else {
            return books.getByISBN(ISBN);
          }
        });
      }
    };
  };

  checkBook = function(book) {
    return (book.title != null) && (book.isbn != null) && Array.isArray(book.refs);
  };

}).call(this);
