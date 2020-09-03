'use strict';
var Automation = /** @class */ (function () {
    function Automation(adapter) {
        this.adapter = adapter;
    }
    Automation.prototype.run = function (arn, body, opts) {
        return this.adapter.run(arn, body, opts);
    };
    return Automation;
}());
module.exports = Automation;
