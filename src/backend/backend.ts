import {
  Request,
  Response,
  ServiceResponse,
  IQueueAdapter,
  IFunctionAdapter,
  IDiscoverAdapter,
  IAddressParser,
  Opts,
  IPubSubAdapter,
  QueueResponse,
  PubSubResponse,
} from '../types';

import Poller from '../poller/poller';

class Backend {
  private addressParser: IAddressParser;
  private discoverAdapter: IDiscoverAdapter;
  private queueAdapter: Poller<IQueueAdapter>;
  private functionAdapter: IFunctionAdapter;
  private pubsubAdapter: IPubSubAdapter;

  constructor(
    addressParser: IAddressParser,
    discoverAdapter: IDiscoverAdapter,
    queueAdapter: Poller<IQueueAdapter>,
    functionAdapter: IFunctionAdapter,
    pubsubAdapter: IPubSubAdapter,
  ) {
    this.addressParser = addressParser;
    this.discoverAdapter = discoverAdapter;
    this.queueAdapter = queueAdapter;
    this.functionAdapter = functionAdapter;
    this.pubsubAdapter = pubsubAdapter;
  }

  public async locate(addr: string): Promise<ServiceResponse> {
    const service = this.addressParser.parse(addr);
    return this.discoverAdapter.locate(service, {});
  }

  async queue(
    addr: string,
    request: Request,
    opts?: Opts,
  ): Promise<QueueResponse> {
    const s = await this.locate(addr);
    return this.queueAdapter.send(s, request, opts);
  }

  async listen(addr: string, opts?: Opts): Promise<Poller<IQueueAdapter>> {
    const s = await this.locate(addr);
    return this.queueAdapter.listen(s, opts);
  }

  public async request(
    addr: string,
    request: Request,
    opts?: Opts,
  ): Promise<Response> {
    const s = await this.locate(addr);
    return this.functionAdapter.request(s, request, opts);
  }

  async publish(
    addr: string,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    const s = await this.locate(addr);
    return this.pubsubAdapter.publish(s, request, opts);
  }

  async subscribe(
    addr: string,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    const s = await this.locate(addr);
    return this.pubsubAdapter.subscribe(s, opts);
  }
}

export default Backend;
