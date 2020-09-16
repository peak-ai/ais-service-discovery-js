import { IAddressParser, ServiceRequest } from '../types';

class DefaultAddressParser implements IAddressParser {
  parse(addr: string): ServiceRequest {
    const [namespace, rest] = addr.split('.');
    const [service, instance] = rest.split('->');
    return {
      instance,
      service,
      namespace,
    };
  }
}

export default DefaultAddressParser;
