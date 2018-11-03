const Configstore = require('configstore');
const {name: packageName} = require('../../package.json');

const config = new Configstore(packageName);

const configKeys = ['auth', 'likeCriteria'];

const isConfigValid = ({
    auth: {phoneNumber, refreshToken} = {},
    likeCriteria: {minPhotos, minBioWords, likeBack} = {},
}) => ({
    auth: [phoneNumber, refreshToken].every(notEmpty),
    likeCriteria: [minPhotos, minBioWords, likeBack].every(notEmpty),
});

const removeInvalidConfigKeys = config => {
    const isValid = isConfigValid(config);

    return Object.keys(isValid).reduce(
        (obj, key) => ({
            ...obj,
            [key]: isValid[key] ? config[key] : undefined,
        }),
        {}
    );
};

const readConfig = () => removeInvalidConfigKeys(config.all);

const saveConfig = newConfig => {
    config.all = newConfig;
};

const notEmpty = value => value !== undefined;

module.exports = {
    configKeys,
    readConfig,
    saveConfig,
};
