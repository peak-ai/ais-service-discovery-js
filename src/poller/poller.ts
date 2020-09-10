import { EventEmitter } from 'events';
import {
  Opts,
  ServiceResponse,
  IQueueAdapter,
  Request,
  QueueResponse,
} from '../types';

class Poller<T extends IQueueAdapter> extends EventEmitter {
  private adapter: T;
  private stopped: boolean;
  private opts?: Opts;

  constructor(adapter: T, opts = {}) {
    super();
    this.emit('ready');
    this.adapter = adapter;
    this.stopped = true;
    this.opts = opts;
  }

  private async poll(name: ServiceResponse, opts?: Opts) {
    if (this.stopped) {
      return null;
    }

    try {
      const message = await this.adapter.listen(name, opts);
      if (message) {
        this.emit('message', message);
      } else {
        this.emit('empty');
      }
    } catch (e) {
      this.emit('error', e);
    }

    setTimeout(() => {
      this.poll.call(this, name);
    }, 100);
    return null;
  }

  public send<S>(
    name: ServiceResponse,
    message: Request,
    opts?: Opts,
  ): Promise<QueueResponse> {
    return this.adapter.send(name, message, opts);
  }

  public async listen(name: ServiceResponse, opts?: Opts): Promise<Poller<T>> {
    if (this.stopped) {
      this.stopped = false;
      this.poll.call(this, name, opts);
      this.emit('started');
      return this;
    }

    return this;
  }

  public stop() {
    if (!this.stopped) {
      this.stopped = true;
      this.emit('stopped');
    }
  }
}

export default Poller;
