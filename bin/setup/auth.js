const {
    startSmsLogin,
    confirmSmsLogin,
    authenticate,
    errors: apiErrors,
} = require('../api');
const {regular, prompt, blankLine} = require('../common/log');

const isEmpty = value => value === undefined || value === '';

const askForConfirmationCode = async ({phoneNumber, loginRequestCode}) => {
    let accessParams;
    let error;

    await prompt([
        {
            type: 'input',
            name: 'confirmationCode',
            message: 'Confirmation code',
            validate: async confirmationCode => {
                if (isEmpty(confirmationCode)) {
                    return false;
                }

                try {
                    accessParams = await confirmSmsLogin({
                        phoneNumber,
                        loginRequestCode,
                        confirmationCode,
                    });
                } catch (err) {
                    if (err === apiErrors.INVALID_CONFIRMATION_CODE) {
                        return 'Invalid confirmation code';
                    }
                    error = err;
                }
                return true;
            },
        },
    ]);

    if (!accessParams) {
        throw error;
    }
    return accessParams;
};

const askForPhoneNumber = async oldValue => {
    let loginRequestCode;
    let error;

    const {phoneNumber} = await prompt([
        {
            type: 'input',
            name: 'phoneNumber',
            message: 'Phone number (with intl. prefix)',
            validate: async phoneNumber => {
                if (isEmpty(phoneNumber)) {
                    return false;
                }

                try {
                    loginRequestCode = await startSmsLogin(phoneNumber);
                } catch (err) {
                    if (err === apiErrors.INVALID_PHONE_NUMBER) {
                        return 'Invalid phone number';
                    }
                    error = err;
                }
                return true;
            },
            default: oldValue,
        },
    ]);

    if (!loginRequestCode) {
        throw error;
    }
    return {phoneNumber, loginRequestCode};
};

module.exports = async oldConfig => {
    blankLine();
    regular('Enter login information');

    const {phoneNumber, loginRequestCode} = await askForPhoneNumber(
        oldConfig.phoneNumber
    );
    const {accessId, accessToken} = await askForConfirmationCode({
        phoneNumber,
        loginRequestCode,
    });
    const {refreshToken} = await authenticate({accessId, accessToken});

    return {phoneNumber, refreshToken};
};
