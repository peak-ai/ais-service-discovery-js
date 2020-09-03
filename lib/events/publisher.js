'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EventEmitter = require('events');
var Publisher = /** @class */ (function (_super) {
    __extends(Publisher, _super);
    function Publisher(eventHandler) {
        var _this = _super.call(this) || this;
        _this.eventHandler = eventHandler;
        return _this;
    }
    Publisher.prototype.publish = function (name, message, _a) {
        var attributes = _a.attributes;
        return this.eventHandler.publish(name, message, attributes);
    };
    return Publisher;
}(EventEmitter));
module.exports = Publisher;
