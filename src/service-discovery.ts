import {
  Backend,
  IAddressParser,
  Opts,
  Request,
  Response, Service,
} from "./types";

class ServiceDiscovery {
  private backend: Backend;
  private addressParser: IAddressParser;

  constructor(backend: Backend) {
    this.backend = backend;
  }

  locate(addr: string): Service {}

  queue(addr: string, request: Request, opts?: Opts): Response {
    const service = this.addressParser.parse(addr);
    return this.backend.queueAdapter(service, request, opts);
  }

  listen(addr: string, request: Request, opts?: Opts): Response {
    const service = this.addressParser.parse(addr);
    return this.backend.queueAdapter.listen(service, request, opts);
  }


  request(addr: string, request: Request, opts?: Opts): Response {
    const service = this.addressParser.parse(addr);
    return this.backend.functionAdapter.request(service, request, opts);
  }


  publish(addr: string, request: Request, opts?: Opts): Response {
    const service = this.addressParser.parse(addr);
    return this.backend.pubsubAdapter.publish(service, request, opts);
  }


  subscribe(addr: string, request: Request, opts?: Opts): Response {
    const service = this.addressParser.parse(addr);
    return this.backend.pubsubAdapter.subscribe(service, request, opts);
  }
}

export default ServiceDiscovery;
