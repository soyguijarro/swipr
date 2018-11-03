const {post} = require('../requests');
const errors = require('./errors');

const BASE_URL = 'https://graph.accountkit.com/v1.2';
const ACCESS_TOKEN = 'AA%7C464891386855067%7Cd1891abb4b0bcdfa0580d9b839f4a522';

const request = (endpoint, params) =>
    post(`${BASE_URL}${endpoint}`, {
        params: {
            access_token: ACCESS_TOKEN,
            credentials_type: 'phone_number',
            response_type: 'token',
            ...params,
        },
    });

const startSmsLogin = async phoneNumber => {
    try {
        const {login_request_code} = await request('/start_login', {
            phone_number: phoneNumber,
        });
        return login_request_code;
    } catch (err) {
        const error = err.statusCode === 400 ? errors.INVALID_PHONE_NUMBER : err;
        throw error;
    }
};

const confirmSmsLogin = async ({phoneNumber, loginRequestCode, confirmationCode}) => {
    try {
        const {id, access_token} = await request('/confirm_login', {
            phone_number: phoneNumber,
            login_request_code: loginRequestCode,
            confirmation_code: confirmationCode,
        });
        return {accessId: id, accessToken: access_token};
    } catch (err) {
        const error = err.statusCode === 400 ? errors.INVALID_CONFIRMATION_CODE : err;
        throw error;
    }
};

module.exports = {startSmsLogin, confirmSmsLogin, errors};
