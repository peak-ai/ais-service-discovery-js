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
} from "../../types";

import SQSAdapter from "../../queue";
import LambdaAdapter from "../../functions";

class AwsBackend {
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

  locate(addr: string): ServiceResponse {
    const service = this.addressParser.parse(addr);
    return this.discoverAdapter.locate(service);
  }

  queue(addr: string, request: Request, opts?: Opts): Response {
    const s = this.locate(addr);
    return this.queueAdapter.queue(s, request, opts);
  }

  listen(addr: string, request: Request, opts?: Opts): Response {
    const s = this.locate(addr);
    return this.queueAdapter.listen(s, request, opts);
  }

  request(addr: string, request: Request, opts?: Opts): Response {
    const s = this.locate(addr);
    return this.functionAdapter.request(s, request, opts);
  }

  publish(addr: string, request: Request, opts?: Opts): Response {
    const s = this.locate(addr);
    return this.pubsubAdapter.publish(s, request, opts);
  }

  subscribe(addr: string, request: Request, opts?: Opts): Response {
    const s = this.locate(addr);
    return this.pubsubAdapter.subscribe(s, request, opts);
  }
}

// Convenience factory function
export function WithAwsBackend() {
  return new AwsBackend(
    new DefaultAddressParser(),
    new CloudmapDiscoverAdapter(),
    new SQSAdapter(),
    new LambdaAdapter(),
  );
}
