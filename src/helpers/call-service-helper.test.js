'use strict';

/* eslint-disable no-restricted-syntax */

const { extractServiceParts } = require('./call-service-helper');

const golden = {
  service: {
    namespace: 'default',
    service: 'service',
  },
  'namespace.service': {
    namespace: 'namespace',
    service: 'service',
  },
  'namespace.service->handler': {
    namespace: 'namespace',
    service: 'service',
    handler: 'handler',
  },
  'service->handler': {
    namespace: 'default',
    service: 'service',
    handler: 'handler',
  },
};

process.env.STAGE = 'latest';

describe('(extractServiceParts)', () => {
  it('should parse service ids', () => {
    for (const [input, expected] of Object.entries(golden)) {
      const result = extractServiceParts(input);
      expect(result).toEqual(expected);
    }
  });
});
