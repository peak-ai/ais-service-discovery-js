'use strict';

class Services {
  constructor(adapter) {
    this.adapter = adapter;
  }

  locate(namespace, service, instance, params = {}) {
    return this.adapter.locate({ namespace, service, instance }, params);
  }
}


module.exports = Services;
