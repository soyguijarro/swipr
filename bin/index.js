const {createApi} = require('./api');
const setup = require('./setup');
const main = require('./main');
const {readConfig, saveConfig, configKeys} = require('./common/config');
const {title, prompt, success, error, blankLine} = require('./common/log');

process.on('SIGINT', () => {
    process.exit();
});

const [, , option] = process.argv;
const shouldRunSetup = option === 'setup';

const isConfigComplete = config =>
    configKeys.every(key => Object.keys(config).includes(key) && config[key]);

const runMain = async config => {
    const api = await createApi(config.auth);
    await main(api, config.likeCriteria);
};

const runSetup = async (oldConfig, configKeyToSetUp) => {
    const newConfig = await setup(oldConfig, configKeyToSetUp);
    saveConfig(newConfig);

    blankLine();
    success('*Configuration saved*\nRun _swipr setup_ to change it at any time');

    return newConfig;
};

const askForConfigToSetUp = async () => {
    blankLine();
    const {configKeyToSetUp} = await prompt([
        {
            type: 'list',
            name: 'configKeyToSetUp',
            message: 'Select an option',
            choices: [
                {name: 'Change liking criteria', value: 'likeCriteria'},
                {name: 'Log in again', value: 'auth'},
            ],
        },
    ]);
    return configKeyToSetUp;
};

(async () => {
    title('*Swipr*');

    try {
        if (shouldRunSetup) {
            const configKeyToSetUp = await askForConfigToSetUp();
            await runSetup(readConfig(), configKeyToSetUp);
            return;
        }

        let config = readConfig();
        if (!isConfigComplete(config)) {
            config = await runSetup(config);
        }

        await runMain(config);
    } catch (err) {
        error(`*Something went wrong*${err.message ? `\n${err.message}` : ''}`);
    }
})();
