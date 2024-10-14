import type { Config } from 'jest';

const config: Config = {
    projects: [
        '<rootDir>/packages/external-apis/*',
        '<rootDir>/packages/api',
        '<rootDir>/packages/utils',
    ],
};

export default config;