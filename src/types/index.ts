export interface IQueueAdapter {
  send(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<QueueResponse>;
  listen(service: ServiceResponse, opts?: Opts): Promise<IMessage | null>;
}

export interface IPubSubAdapter {
  publish(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse>;
  subscribe(service: ServiceResponse, opts?: Opts): Promise<PubSubResponse>;
}

export interface IFunctionAdapter {
  request(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<Response>;
}

export type Attributes = {
  [key: string]: string | number | boolean;
};

export type ServiceResponse = {
  rid: string;
  attributes?: Attributes;
};

export interface IDiscoverAdapter {
  locate(serviceRequest: ServiceRequest, opts?: Opts): Promise<ServiceResponse>;
}

export type Backend = {
  queueAdapter: IQueueAdapter;
  pubsubAdapter: IPubSubAdapter;
  functionAdapter: IFunctionAdapter;
  discoverAdapter: IDiscoverAdapter;
  // automationAdapter: IAutomationAdapter, @todo - not implemented, low priority
};

export type Request = {
  body: string;
};

export type Response = {
  body: string;
};

export type Opts = {
  [key: string]: boolean | string | number;
};

export type ServiceRequest = {
  instance: string;
  service: string;
  namespace: string;
};

export interface IAddressParser {
  parse(addr: string): ServiceRequest;
}

// Message response, for example returns a message ID
// from an SQS queue
export type MessageResponse = {
  id: string;
};

// Extends a message response with a delete method
export interface IMessage extends MessageResponse {
  message: string;
  delete(receipt: string, name: string): Promise<void>;
}

export type QueueResponse = {
  id: string;
  body?: string;
};

export type PubSubResponse = {
  // Some cases we subscribe to something, which turns a resource id,
  // For example an SNS subscription returns an ARN.
  rid?: string;
  messageId?: string;
};

export interface IEventHandler<T, S> {
  listen(name: ServiceResponse): Promise<IEventHandler<T, S>>;
  send(name: ServiceResponse, message: T, opts?: Opts): Promise<S>;
}
