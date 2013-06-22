(function() {
  var errors;

  errors = {
    'NOT_FOUND': {
      msg: 'Not Found',
      code: 404
    },
    'INVALID_ISBN': {
      msg: 'ISBN must be a 13-characters string',
      code: 400
    },
    'BAD_PARAMETER': {
      msg: 'Malformed request',
      code: 400
    },
    'INVALID_QUERY': {
      msg: 'query must be a string',
      code: 400
    },
    'CONSISTENCY_ERROR_ISBN': {
      msg: 'Two book with same ISBN have been found',
      code: 500
    },
    'CONSISTENCY_ERROR_URI': {
      msg: 'Two book with same URI have been found',
      code: 500
    }
  };

  module.exports = errors;

}).call(this);
