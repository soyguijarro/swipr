const {get, post} = require('./requests');
const errors = require('./errors');

const BASE_URL = 'https://api.gotinder.com';

const passUser = (apiToken, userId) =>
    get(`${BASE_URL}/pass/${userId}`, {token: apiToken});

const likeUser = async (apiToken, userId) => {
    const response = await get(`${BASE_URL}/like/${userId}`, {token: apiToken});

    if (!response.likes_remaining) {
        throw errors.OUT_OF_LIKES;
    }
    return response;
};

const getMatchRecommendations = async apiToken => {
    const {results} = await get(`${BASE_URL}/user/recs`, {token: apiToken});
    if (!results || !results.length) {
        throw errors.NO_MATCH_RECOMMENDATIONS;
    }
    return results;
};

const getApiToken = async ({phoneNumber, refreshToken}) => {
    const {
        data: {api_token},
    } = await post(`${BASE_URL}/v2/auth/login/sms`, {
        body: {
            phone_number: phoneNumber,
            refresh_token: refreshToken,
        },
    });
    return api_token;
};

const getRefreshToken = async ({phoneNumber, otpCode}) => {
    try {
        const {
            data: {refresh_token},
        } = await post(`${BASE_URL}/v2/auth/sms/validate`, {
            params: {auth_type: 'sms'},
            body: {phone_number: phoneNumber, otp_code: otpCode},
        });
        return refresh_token;
    } catch (err) {
        const error = err.statusCode === 400 ? errors.INVALID_OTP_CODE : err;
        throw error;
    }
};

const requestOtpCode = async phoneNumber => {
    try {
        const {
            data: {otp_length},
        } = await post(`${BASE_URL}/v2/auth/sms/send`, {
            params: {auth_type: 'sms'},
            body: {phone_number: phoneNumber},
        });
        return otp_length;
    } catch (err) {
        const error = err.statusCode === 400 ? errors.INVALID_PHONE_NUMBER : err;
        throw error;
    }
};

module.exports = {
    requestOtpCode,
    getRefreshToken,
    getApiToken,
    getMatchRecommendations,
    likeUser,
    passUser,
};
