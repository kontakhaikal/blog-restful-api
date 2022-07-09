//ts-check
/** @type {import ("jest").Config} */

module.exports = {
    transform: {
        '^.+\\.ts$': '@swc/jest',
    },
};
