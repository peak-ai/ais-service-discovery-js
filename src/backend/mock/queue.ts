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

  public async queue(
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
      message: config.resolve?.mockedResponse as string,
      messageId: '',
      delete: this.delete('', service.rid),
    };
  }

  public delete(id: string, rid: string): () => Promise<void> {
    return async () => {
      // No-op
    };
  }
}

export default Queue;
