'use strict';

/* This config runs compiled tests against our compiled source
 * i.e. for our pre-commit hook, CI, and publish script.
 * As we run tsc to determine the syntactical validity
 * of our TypeScript source, as well as to build the output JS
 * for distribution. As we also compile the tests during this
 * phase, we can run them without the overhead of using the
 * ts-jest plugin, reducing overall execution time. */

// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  testRegex: 'dist(/.*)?/.*.test.js$',
};
