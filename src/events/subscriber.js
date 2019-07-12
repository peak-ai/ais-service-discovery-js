'use strict';

const EventEmitter = require('events');

const privates = {
  async poll(name) {
    if (this.stopped) {
      return null;
    }

    try {
      const message = await this.eventHandler.subscribe(name);
      if (message) {
        this.emit('message', message);
      } else {
        this.emit('empty');
      }
    } catch (e) {
      this.emit('error', e);
    }
    privates.poll.call(this, name);
    return null;
  },
};

class Subscriber extends EventEmitter {
  constructor(eventHandler) {
    super();
    this.eventHandler = eventHandler;
    this.stopped = true;
  }

  async subscribe(name) {
    if (this.stopped) {
      this.stopped = false;
      privates.poll.call(this, name);
      this.emit('started');
      return this;
    }
    return null;
  }

  stop() {
    if (!this.stopped) {
      this.stopped = true;
      this.emit('stopped');
    }
  }
}

module.exports = Subscriber;
