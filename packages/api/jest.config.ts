import type { Config } from 'jest';
import { createJsWithTsEsmPreset } from 'ts-jest'

const config: Config = {
    ...createJsWithTsEsmPreset()
};

export default config;