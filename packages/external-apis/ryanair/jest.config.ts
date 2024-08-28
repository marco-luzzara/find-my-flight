import type { Config } from 'jest';
import baseConfig from '../../../jest.config.base'

const config: Config = {
    ...(baseConfig as Config)
};

export default config;