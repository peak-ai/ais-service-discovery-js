import {
  ServiceRequest
} from "../types";

export const defaultAddressParser = (addr: string): ServiceRequest => {
  return {
    instance,
    service,
    namespace,
  };
};

export default defaultAddressParser;
