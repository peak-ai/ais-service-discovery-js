export interface IQueueAdapter {
  queue(service: ServiceResponse, request: Request, opts?: Opts): Response,
  listen(service: ServiceResponse, request: Request, opts?: Opts): Response,
}

export interface IPubSubAdapter {
  publish(service: ServiceResponse, request: Request, opts?: Opts): Response,
  subscribe(service: ServiceResponse, request: Request, opts?: Opts): Response,
}

export interface IFunctionAdapter {
  request(service: ServiceResponse, request: Request, opts?: Opts): Response,
}

export type Attribute = {};

export type Attributes = Attribute[];

export type ServiceResponse = {
  id: string;
  attributes: Attributes;
};

export interface IDiscoverAdapter {
  locate(service: ServiceRequest): ServiceResponse,
}

export type Backend = {
  queueAdapter: IQueueAdapter,
  pubsubAdapter: IPubSubAdapter,
  functionAdapter: IFunctionAdapter,
  discoverAdapter: IDiscoverAdapter,
  // automationAdapter: IAutomationAdapter, @todo - not implemented, low priority
};

export type Request = {
  body: string;
};

export type Response = {
  body: string;
};

export type Opts = {};

export type ServiceRequest = {
  instance:  string;
  service: string;
  namespace: string;
};

export interface IAddressParser {
  parse(addr: string): ServiceRequest;
};
