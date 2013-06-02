exports['factory'] = function(message, err) {
    // console.log(message);
    var errorConf = {
        invalidISBN: 0,
        invalidURI: 1,
        notAvaiable: 2
    },
        error;

    if (errorConf[message] === undefined) {

        error = {
            message: 'Unhandled error',
            code: 4,
            error: null
        };

    } else {

        error = {
            message: message,
            code: errorConf[message]
        };

        if (err) {
            error.err = err;
        } else {
            error.err = null;
        }

    }
    return error;
};