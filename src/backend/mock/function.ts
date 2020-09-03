import AWS from 'aws-sdk';
import {IFunctionAdapter, Opts, ServiceResponse, Request, Response} from "../../types";
import {Config} from "./types";

class FunctionAdapter implements IFunctionAdapter {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async request(serviceRequest: ServiceResponse, request: Request, opts?: Opts): Promise<Response> {
    const s = this.config[serviceRequest.rid];
    const payload = s.resolve.mockedResponse;
    if (!payload) {
      throw new Error('you must configure a mockedResponse property on your resolver for this addr');
    }
    return {
      body: JSON.stringify(payload),
    };
  }
}

export default FunctionAdapter;
