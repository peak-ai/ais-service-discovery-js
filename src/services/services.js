'use strict';

class Services {
  constructor(adapter) {
    this.adapter = adapter;
  }

  discover(namespace, service, params = {}) {
    return this.adapter.discover(namespace, service, params);
  }

  find(namespace, service, instance, params = {}) {
    return this.adapter.find(namespace, service, instance, params);
  }
}

module.exports = Services;
