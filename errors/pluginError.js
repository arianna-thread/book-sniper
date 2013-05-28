exports['factory'] = function(message, err) {
    var errorConf = {
        invalidISBN: 0,
        invalidURI: 1,
        notAvaiable: 3
    },
        error;

    if (errorConf[message] === undefined) {

        error = {
            message: 'Unhandled error',
            code: 5,
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
    console.log(JSON.stringify(error));
    return error;
};