'use strict';
var defaultNamespace = function () {
    var ENV = process.env.ENV;
    if (ENV) {
        return "default-" + ENV;
    }
    return 'default';
};
var NAMESPACE_NOTATION = '.';
var HANDLER_NOTATION = '->';
var getHandler = function (serviceId) {
    if (serviceId.includes(HANDLER_NOTATION)) {
        return serviceId.split(HANDLER_NOTATION)[1];
    }
    return false;
};
// This takes a serviceId in the user-facing form and
// reconstitutes it into parts an in our internal form.
//
// For example, `namespace.service->handler`, becomes
// `namespace.service.handler`.
//
// And `service->handler` becomes:
// `service.handler`. This is because we have to
// differentiate between the three segments as there's
// no way of assuring which is a namespace and which is
// a service, as a namespace is optional.
var extractServiceParts = function (serviceId) {
    // If service ID contains a NAMESPACE_NOTATION - which denotes that
    // the ID contains both a namespace and a service.
    // Split the two, check for a handler
    if (serviceId.includes(NAMESPACE_NOTATION)) {
        var _a = serviceId.split(NAMESPACE_NOTATION), namespace = _a[0], service_1 = _a[1];
        // Check if the service contains a handler, denoted
        // by a HANDLER_NOTATION.
        var instance_1 = getHandler(service_1);
        var srv = service_1.split(HANDLER_NOTATION)[0];
        return {
            namespace: namespace,
            service: srv,
            instance: instance_1,
        };
    }
    var instance = getHandler(serviceId);
    var service = serviceId.split(HANDLER_NOTATION)[0];
    // Default behavior, returns serviceId
    // given, with the default namespace.
    return {
        namespace: defaultNamespace(),
        service: service,
        instance: instance,
    };
};
module.exports = {
    extractServiceParts: extractServiceParts,
    defaultNamespace: defaultNamespace,
};
