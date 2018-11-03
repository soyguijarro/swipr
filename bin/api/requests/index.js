const fetch = require('./fetch');

const addParamsToUrl = (url, params = {}) => {
    const querystring = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');

    return `${url}?${querystring}`;
};

const post = (url, {params, body}) =>
    fetch(addParamsToUrl(url, params), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body ? JSON.stringify(body) : undefined,
    });

const get = (url, {params, token}) =>
    fetch(addParamsToUrl(url, params), {
        headers: {'X-Auth-Token': token},
    });

module.exports = {
    get,
    post,
};
