const fetch = require('node-fetch');

const parseJson = response => response.json();

const checkStatus = response => {
    const {status, statusText} = response;

    if (status >= 200 && status < 300) {
        return response;
    }

    const error = Error(statusText);
    error.statusCode = status;
    throw error;
};

module.exports = (url, options = {}) =>
    fetch(url, options)
        .then(checkStatus)
        .then(parseJson);
