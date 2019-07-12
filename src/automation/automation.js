'use strict';

class Automation {
  constructor(adapter) {
    this.adapter = adapter;
  }

  run(arn, body, opts) {
    return this.adapter.run(arn, body, opts);
  }
}

module.exports = Automation;
