'use strict';
var Func = /** @class */ (function () {
    function Func(adapter) {
        this.adapter = adapter;
    }
    Func.prototype.call = function () {
        var _a;
        var config = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            config[_i] = arguments[_i];
        }
        return (_a = this.adapter).call.apply(_a, config);
    };
    return Func;
}());
module.exports = Func;
