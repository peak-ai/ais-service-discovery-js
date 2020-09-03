"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultAddressParser = /** @class */ (function () {
    function DefaultAddressParser() {
    }
    DefaultAddressParser.prototype.parse = function (addr) {
        var _a = addr.split('.'), namespace = _a[0], service = _a[1];
        var _b = service.split('->'), _ = _b[0], instance = _b[1];
        return {
            instance: instance,
            service: service,
            namespace: namespace,
        };
    };
    return DefaultAddressParser;
}());
exports.default = DefaultAddressParser;
