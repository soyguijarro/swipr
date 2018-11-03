const inquirer = require('inquirer');
const chalk = require('chalk');

const applyMarks = str =>
    str
        .replace(/\*([^*]+)\*/, (match, group) => chalk.bold(group))
        .replace(/_([^_]+)_/, (match, group) => chalk.dim(group));

const print = method => (str, symbol = '') =>
    method(applyMarks(`${symbol}${symbol && ' '}${str}`));

/* eslint-disable no-console */
const printInfo = print(console.info);
const printError = print(console.error);
/* eslint-enable no-console */

const pass = str => printInfo(str, chalk.bold.yellow('👈'));

const like = str => printInfo(str, chalk.bold.magenta('👉'));

const error = str => printError(str, chalk.bold.red('❌'));

const success = str => printInfo(str, chalk.bold.green('✓'));

const regular = printInfo;

const title = str => {
    printInfo(str, chalk.bold.magenta('♥️ '));
};

const prompt = questions =>
    inquirer.prompt(
        questions.map(question => ({
            prefix: chalk.bold.cyan('?'),
            ...question,
        }))
    );

const blankLine = () => {
    printInfo('');
};

module.exports = {
    blankLine,
    error,
    success,
    pass,
    like,
    regular,
    title,
    prompt,
};
