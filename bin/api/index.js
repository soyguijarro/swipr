const {
    startSmsLogin,
    confirmSmsLogin,
    errors: accountkitErrors,
} = require('./accountkit');
const {
    authenticate,
    getApiToken,
    errors: tinderErrors,
    ...apiMethods
} = require('./tinder');

const UNAUTHORIZED_CODE = 401;

let apiToken;

const refreshApiToken = async ({phoneNumber, refreshToken}) => {
    try {
        apiToken = await getApiToken({phoneNumber, refreshToken});
    } catch (err) {
        if (err.statusCode === UNAUTHORIZED_CODE) {
            throw Error(
                'There is an authentication problem. Run _swipr setup_ to try to log in again.'
            );
        }
        throw err;
    }
};

const createApi = async ({phoneNumber, refreshToken}) => {
    await refreshApiToken({phoneNumber, refreshToken});

    return Object.keys(apiMethods).reduce((api, method) => {
        api[method] = async (...args) => {
            const callApiMethod = () => apiMethods[method](apiToken, ...args);

            try {
                const response = await callApiMethod();
                return response;
            } catch (err) {
                if (err.statusCode === UNAUTHORIZED_CODE) {
                    await refreshApiToken({phoneNumber, refreshToken});
                    return callApiMethod();
                }
                throw err;
            }
        };

        return api;
    }, {});
};

module.exports = {
    createApi,
    startSmsLogin,
    confirmSmsLogin,
    authenticate,
    errors: {...accountkitErrors, ...tinderErrors},
};
