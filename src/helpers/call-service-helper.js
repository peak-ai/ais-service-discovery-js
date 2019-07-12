'use strict';

const defaultNamespace = () => {
  const { ENV } = process.env;
  if (ENV) {
    return `default-${ENV}`;
  }
  return 'default';
};

const NAMESPACE_NOTATION = '.';

const HANDLER_NOTATION = '->';

const getHandler = (serviceId) => {
  if (serviceId.includes(HANDLER_NOTATION)) {
    return serviceId.split(HANDLER_NOTATION);
  }
  return false;
};

// This takes a serviceId in the user-facing form and
// reconsitutes it into parts an in our internal form.
//
// For example, `namespace.service->handler`, becomes
// `namespace.service.handler`.
//
// And `service->handler` becomes:
// `service.handler`. This is because we have to
// differentiate between the three segments as there's
// no way of assuring which is a namespace and which is
// a service, as a namespace is optional.
const extractServiceParts = (serviceId) => {
  // If service ID contains a NAMESPACE_NOTATION - which denotes that
  // the ID contains both a namespace and a service.
  // Split the two, check for a handler
  if (serviceId.includes(NAMESPACE_NOTATION)) {
    const [namespace, service] = serviceId.split(NAMESPACE_NOTATION);

    // Check if the service contains a handler, denoted
    // by a HANDLER_NOTATION.
    const hasHandler = getHandler(service);
    if (hasHandler) {
      const [serviceName, handler] = hasHandler;
      return {
        namespace,
        service: serviceName,
        handler,
      };
    }
    return {
      namespace,
      service,
    };
  }

  // If service has a function handler
  // return service with handler in
  // base format.
  const hasHandler = getHandler(serviceId);
  if (hasHandler) {
    const [serviceName, handler] = hasHandler;
    return {
      namespace: defaultNamespace(),
      service: serviceName,
      handler,
    };
  }

  // Default behavior, returns serviceId
  // given, with the default namespace.
  return {
    namespace: defaultNamespace(),
    service: serviceId,
  };
};

module.exports = {
  extractServiceParts,
  defaultNamespace,
};
