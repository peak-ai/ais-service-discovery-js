import {
  Opts,
  Request,
  IQueueAdapter,
  QueueResponse,
  ServiceResponse,
  IMessage,
} from '../../types';
import { Config } from './types';

class Queue implements IQueueAdapter {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async send(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<QueueResponse> {
    const s = service.rid;
    const config = this.config[s];
    return { id: config.resolve.mockedResponse as string };
  }

  public async listen(
    service: ServiceResponse,
    opts?: Opts,
  ): Promise<IMessage | null> {
    const s = service.rid;
    const config = this.config[s];
    return {
      id: '',
      message: config.resolve?.mockedResponse as string,
      delete: this.delete('', service.rid),
    };
  }

  public delete(_id: string, _rid: string): () => Promise<void> {
    return async () => {
      // No-op
    };
  }
}

export default Queue;
