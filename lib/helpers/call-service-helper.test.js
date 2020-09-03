'use strict';
/* eslint-disable no-restricted-syntax */
var extractServiceParts = require('./call-service-helper').extractServiceParts;
var golden = {
    'namespace.service->handler': {
        namespace: 'namespace',
        service: 'service',
        instance: 'handler',
    },
    'service->handler': {
        namespace: 'default',
        service: 'service',
        instance: 'handler',
    },
};
process.env.STAGE = 'latest';
describe('(extractServiceParts)', function () {
    it('should parse service ids', function () {
        for (var _i = 0, _a = Object.entries(golden); _i < _a.length; _i++) {
            var _b = _a[_i], input = _b[0], expected = _b[1];
            var result = extractServiceParts(input);
            expect(result).toEqual(expected);
        }
    });
});
