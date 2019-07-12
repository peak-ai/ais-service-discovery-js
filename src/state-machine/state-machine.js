'use strict';

class StateMachine {
  constructor(adapter) {
    this.adapter = adapter;
  }

  start(arn, body) {
    return this.adapter.start(arn, body);
  }
}

module.exports = StateMachine;
