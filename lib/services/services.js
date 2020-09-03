'use strict';
var Services = /** @class */ (function () {
    function Services(adapter) {
        this.adapter = adapter;
    }
    Services.prototype.discover = function (namespace, service, params) {
        if (params === void 0) { params = {}; }
        return this.adapter.discover(namespace, service, params);
    };
    Services.prototype.find = function (namespace, service, instance, params) {
        if (params === void 0) { params = {}; }
        return this.adapter.find(namespace, service, instance, params);
    };
    return Services;
}());
module.exports = Services;
