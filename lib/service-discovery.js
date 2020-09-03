"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceDiscovery = /** @class */ (function () {
    function ServiceDiscovery(backend) {
        this.backend = backend;
    }
    ServiceDiscovery.prototype.queue = function (addr, request, opts) {
        var service = this.addressParser.parse(addr);
        return this.backend.queueAdapter(service, request, opts);
    };
    ServiceDiscovery.prototype.listen = function (addr, request, opts) {
        var service = this.addressParser.parse(addr);
        return this.backend.queueAdapter.listen(service, request, opts);
    };
    ServiceDiscovery.prototype.request = function (addr, request, opts) {
        var service = this.addressParser.parse(addr);
        return this.backend.functionAdapter.request(service, request, opts);
    };
    ServiceDiscovery.prototype.publish = function (addr, request, opts) {
        var service = this.addressParser.parse(addr);
        return this.backend.pubsubAdapter.publish(service, request, opts);
    };
    ServiceDiscovery.prototype.subscribe = function (addr, request, opts) {
        var service = this.addressParser.parse(addr);
        return this.backend.pubsubAdapter.subscribe(service, request, opts);
    };
    return ServiceDiscovery;
}());
exports.default = ServiceDiscovery;
