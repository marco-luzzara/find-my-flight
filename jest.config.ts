// /** @type {import('ts-jest').JestConfigWithTsJest} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     "^.+.tsx?$": ["ts-jest", {}],
//   },
//   testPathIgnorePatterns: ['<rootDir>/dist/'],
//   globals: {
//     "ts-jest": {
//       useESM: true
//     }
//   }
// };

import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  roots: ["test/"],
  preset: "ts-jest/presets/default-esm"
};

export default jestConfig;