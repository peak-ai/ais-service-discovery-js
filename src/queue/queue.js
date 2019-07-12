'use strict';

const EventEmitter = require('events');

const privates = {
  async poll(name) {
    if (this.stopped) {
      return null;
    }

    try {
      const message = await this.adapter.listen(name);
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

class Queue extends EventEmitter {
  constructor(adapter, opts = {}) {
    super();
    this.adapter = adapter;
    this.stopped = true;
    this.opts = opts;
  }

  send(name, message) {
    return this.adapter.send(name, message);
  }

  async listen(name) {
    if (this.stopped) {
      this.stopped = false;
      privates.poll.call(this, name);
      this.emit('started');
      return this;
    }
    return this;
  }

  stop() {
    if (!this.stopped) {
      this.stopped = true;
      this.emit('stopped');
    }
  }
}

module.exports = Queue;
