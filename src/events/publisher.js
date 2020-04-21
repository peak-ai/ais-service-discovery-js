'use strict';

const EventEmitter = require('events');

class Publisher extends EventEmitter {
  constructor(eventHandler) {
    super();
    this.eventHandler = eventHandler;
  }

  publish(name, message, { attributes }) {
    return this.eventHandler.publish(name, message, attributes);
  }
}

module.exports = Publisher;
