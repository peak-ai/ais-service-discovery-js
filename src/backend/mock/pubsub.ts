import {
  IPubSubAdapter,
  Request,
  ServiceResponse,
  Opts,
  PubSubResponse,
} from '../../types';

import { Config } from './types';

class PubSub implements IPubSubAdapter {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async publish(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    const s = service.rid;
    const config = this.config[s];
    return {
      messageId: config.resolve?.mockedResponse as string,
    };
  }

  async subscribe(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    const s = service.rid;
    const config = this.config[s];
    return {
      rid: config.resolve?.mockedResponse as string,
    };
  }
}

export default PubSub;
