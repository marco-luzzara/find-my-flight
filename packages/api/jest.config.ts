import type { JestConfigWithTsJest } from "ts-jest";
import baseConfig from '../../jest.config.base-esm'

const config: JestConfigWithTsJest = {
    ...(baseConfig as JestConfigWithTsJest)
};

export default config;
