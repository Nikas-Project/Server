const config = {
    modulePaths: ["<rootDir>"],
    moduleNameMapper: {
        ".svg$": "<rootDir>/tests/mocks/fileMock.js",
    },
    testEnvironment: "jsdom",
};

module.exports = config;
