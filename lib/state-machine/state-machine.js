'use strict';
var StateMachine = /** @class */ (function () {
    function StateMachine(adapter) {
        this.adapter = adapter;
    }
    StateMachine.prototype.start = function (arn, body) {
        return this.adapter.start(arn, body);
    };
    return StateMachine;
}());
module.exports = StateMachine;
