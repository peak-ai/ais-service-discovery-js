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
  IMessage,
  PubSubResponse,
} from '../types';

class Backend {
  private addressParser: IAddressParser;
  private discoverAdapter: IDiscoverAdapter;
  private queueAdapter: IQueueAdapter;
  private functionAdapter: IFunctionAdapter;
  private pubsubAdapter: IPubSubAdapter;

  constructor(
    addressParser: IAddressParser,
    discoverAdapter: IDiscoverAdapter,
    queueAdapter: IQueueAdapter,
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
    return this.queueAdapter.queue(s, request, opts);
  }

  async listen(
    addr: string,
    request: Request,
    opts?: Opts,
  ): Promise<IMessage | null> {
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
