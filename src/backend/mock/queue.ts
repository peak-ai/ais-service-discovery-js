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
  private messages: Request[] = [];

  constructor(config: Config) {
    this.config = config;
    this.messages = [];
  }

  public async send(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<QueueResponse> {
    const s = service.rid;
    const config = this.config[s];
    this.messages.push(request);
    return { id: config.resolve.mockedResponse as string };
  }

  public async listen(
    service: ServiceResponse,
    opts?: Opts,
  ): Promise<IMessage | null> {
    const s = service.rid;
    const config = this.config[s];

    // Use the next message that was sent, or fallback
    // to the mocked response, this allows us to mock
    // 'sends' in the same process, also.
    const [nextMessage] = this.messages;
    return {
      id: '',
      message: nextMessage?.body || (config.resolve?.mockedResponse as string),
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
