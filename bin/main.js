const differenceInYears = require('date-fns/difference_in_years');
const {errors: apiErrors} = require('./api');
const {like, pass, error, blankLine} = require('./common/log');

const sleep = ms =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });

const getAge = birthDate => differenceInYears(Date.now(), birthDate);

const printUserInfo = ({name, birth_date, photos}, liked) => {
    const age = getAge(new Date(birth_date));
    const numberOfPhotos = photos.length;
    const userInfo = `${name}, ${age}. ${numberOfPhotos} photo${
        numberOfPhotos > 1 ? 's' : ''
    }.`;

    const logger = liked ? like : pass;
    logger(userInfo);
};

const createShouldLikeUser = ({minPhotos, minBioWords, likeBack}) => ({
    is_super_like,
    bio,
    photos,
}) =>
    (likeBack && is_super_like) ||
    (bio.split(' ').length >= minBioWords && photos.length >= minPhotos);

const createUserProcessor = (api, likeCriteria) => {
    const shouldLikeUser = createShouldLikeUser(likeCriteria);

    return async user => {
        const shouldLike = shouldLikeUser(user);
        const action = shouldLike ? api.likeUser : api.passUser;
        await action(user._id);
        return shouldLike;
    };
};

const createUserFetcher = api => api.getMatchRecommendations;

const startProcessingLoop = async (fetchUsers, processUser) => {
    const users = await fetchUsers();
    for (const user of users) {
        const wasLiked = await processUser(user);
        printUserInfo(user, wasLiked);
        await sleep(500);
    }

    await startProcessingLoop(fetchUsers, processUser);
};

const main = async (api, likeCriteria) => {
    try {
        blankLine();

        const fetchUsers = createUserFetcher(api);
        const processUser = createUserProcessor(api, likeCriteria);
        await startProcessingLoop(fetchUsers, processUser);
    } catch (err) {
        blankLine();

        switch (err) {
            case apiErrors.NO_MATCH_RECOMMENDATIONS:
                error('*There are no match recommendations');
                break;
            case apiErrors.OUT_OF_LIKES:
                error('*You are out of likes*');
                break;
            default:
                throw err;
        }
    }
};

module.exports = main;
