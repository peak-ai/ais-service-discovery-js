'use strict';

class Services {
  constructor(adapter) {
    this.adapter = adapter;
  }

  discover(namespace, name, handler) {
    return this.adapter.discover(namespace, name, handler);
  }
}

module.exports = Services;
