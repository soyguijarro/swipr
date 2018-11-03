const {get, post} = require('../requests');
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

const authenticate = async ({accessId, accessToken}) => {
    const {
        data: {api_token, refresh_token},
    } = await post(`${BASE_URL}/v2/auth/login/accountkit`, {
        body: {
            id: accessId,
            token: accessToken,
        },
    });
    return {apiToken: api_token, refreshToken: refresh_token};
};

module.exports = {
    authenticate,
    getApiToken,
    getMatchRecommendations,
    likeUser,
    passUser,
    errors,
};
