const {regular, prompt, blankLine} = require('../common/log');

const isEmpty = value => value === undefined || value === '';

const orElse = (value, defaultValue) => (isEmpty(value) ? defaultValue : value);

const validateNumber = value => !isEmpty(value) && Number.isInteger(Number(value));

const askForLikeCriteria = oldValues =>
    prompt([
        {
            type: 'input',
            name: 'minPhotos',
            message: 'Minimum number of photos',
            validate: validateNumber,
            filter: str => Number(str),
            default: orElse(oldValues.minPhotos, 1),
        },
        {
            type: 'input',
            name: 'minBioWords',
            message: 'Minimum bio length (in words)',
            validate: validateNumber,
            filter: str => Number(str),
            default: orElse(oldValues.minBioWords, 0),
        },
        {
            type: 'confirm',
            name: 'likeBack',
            message: 'Like back',
            default: orElse(oldValues.likeBack, true),
        },
    ]);

module.exports = async oldConfig => {
    blankLine();
    regular('Enter your liking criteria');

    return askForLikeCriteria(oldConfig);
};
