import type { Config } from 'jest';
import { createJsWithTsEsmPreset } from 'ts-jest'

const config: Config = {
    testEnvironment: "node",
    ...createJsWithTsEsmPreset({
        tsConfig: '<rootDir>/tsconfig.test.json'
    }),
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};

export default config;