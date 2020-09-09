'use strict';

/* This config is for local development, using
 * ts-jest to avoid having to manually recompiling source
 * changes with tsc before re-running tests. This setup is
 * particularly useful for Jest's watch mode */

// eslint-disable-next-line no-undef
module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: [
    // I'm sure this could be nicer...
    'src(/.*)?/.*.test.ts$',
    'src(/.*)?/.*.test.js$',
    'examples(/.*)?/.*.test.ts$',
    'examples(/.*)?/.*.test.js$',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    },
  },
};
