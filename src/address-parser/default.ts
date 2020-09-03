import {
  IAddressParser,
  ServiceRequest
} from "../types";

class DefaultAddressParser implements IAddressParser {
  parse(addr: string): ServiceRequest {
    const [namespace, service] = addr.split('.');
    const [_, instance] = service.split('->');
    return {
      instance,
      service,
      namespace,
    };
  }
}

export default DefaultAddressParser;
