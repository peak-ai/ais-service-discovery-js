'use strict';

class Func {
  constructor(adapter) {
    this.adapter = adapter;
  }

  call(...config) {
    return this.adapter.call(...config);
  }
}

module.exports = Func;
