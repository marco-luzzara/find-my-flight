import type { Config } from 'jest';
import baseConfig from '../../../jest.config.base-esm.ts';

const config: Config = {
    ...(baseConfig as Config)
};

export default config;