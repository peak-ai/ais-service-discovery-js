import {
  Opts,
  IDiscoverAdapter,
  ServiceRequest,
  ServiceResponse,
} from "../../types";
import {Config} from "./types";

class Registry implements  IDiscoverAdapter {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async locate(serviceRequest: ServiceRequest, opts?: Opts): Promise<ServiceResponse> {
    const {
      namespace,
      service,
      instance
    } = serviceRequest;
    const addr = `${namespace}.${service}->${instance}`;
    return {
      rid: addr,
      attributes: {},
    };
  }
}

export default Registry;
