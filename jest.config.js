const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest/utils");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.{js,ts}", "!<rootDir>/**/*.inject.ts"],
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/bin/",
    "<rootDir>/.eslintrc.js",
    "<rootDir>/babel.config.js",
    "<rootDir>/jest.config.js",
    "<rootDir>/coverage/",
    "<rootDir>/src/app.ts",
    "<rootDir>/src/server.ts",
  ],
};
