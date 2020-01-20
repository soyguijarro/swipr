const {requestOtpCode, getRefreshToken, errors: apiErrors} = require('../api');
const {regular, prompt, blankLine} = require('../common/log');

const isEmpty = value => value === undefined || value === '';

const askForConfirmationCode = async ({phoneNumber, otpLength}) => {
    let refreshToken;
    let error;

    await prompt([
        {
            type: 'input',
            name: 'confirmationCode',
            message: 'Confirmation code',
            validate: async otpCode => {
                if (isEmpty(otpCode)) {
                    return false;
                }

                if (otpCode.length !== otpLength) {
                    return `Code must be ${otpLength} digits long`;
                }

                try {
                    refreshToken = await getRefreshToken({
                        phoneNumber,
                        otpCode,
                    });
                } catch (err) {
                    if (err === apiErrors.INVALID_OTP_CODE) {
                        return 'Invalid confirmation code';
                    }
                    error = err;
                }
                return true;
            },
        },
    ]);

    if (!refreshToken) {
        throw error;
    }
    return refreshToken;
};

const askForPhoneNumber = async oldValue => {
    let otpLength;
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
                    otpLength = await requestOtpCode(phoneNumber);
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

    if (!otpLength) {
        throw error;
    }
    return {phoneNumber, otpLength};
};

module.exports = async oldConfig => {
    blankLine();
    regular('Enter login information');

    const {phoneNumber, otpLength} = await askForPhoneNumber(oldConfig.phoneNumber);
    const refreshToken = await askForConfirmationCode({
        phoneNumber,
        otpLength,
    });

    return {phoneNumber, refreshToken};
};
