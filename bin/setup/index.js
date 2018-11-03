const casex = require('casex');
const {configKeys} = require('../common/config');

const toModuleName = key => casex(key, 'ca-se');

const setup = async (oldConfig, configKeyToSetUp) => {
    const newConfig = oldConfig;
    for (const key of configKeys) {
        const oldConfigKeyValue = oldConfig[key];
        if (!oldConfigKeyValue || key === configKeyToSetUp) {
            const setUpKey = require(`./${toModuleName(key)}`);
            newConfig[key] = await setUpKey(oldConfigKeyValue || {});
        }
    }

    return newConfig;
};

module.exports = setup;
