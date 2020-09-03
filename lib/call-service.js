'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var AWS = require('aws-sdk');
var omit = require('ramda').omit;
var _a = require('./helpers/call-service-helper'), defaultNamespace = _a.defaultNamespace, extractServiceParts = _a.extractServiceParts;
var lambda = new AWS.Lambda();
var sqs = new AWS.SQS();
var sns = new AWS.SNS();
var ssm = new AWS.SSM();
var stateMachine = new AWS.StepFunctions();
var serviceDiscovery = new AWS.ServiceDiscovery();
var _b = require('./events'), SNS = _b.SNS, Publisher = _b.Publisher;
var _c = require('./queue'), SQS = _c.SQS, Queue = _c.Queue;
var _d = require('./functions'), Func = _d.Func, LambdaAdapter = _d.LambdaAdapter;
var _e = require('./state-machine'), StateMachine = _e.StateMachine, StepFunctionAdapter = _e.StepFunctionAdapter;
var _f = require('./automation'), Automation = _f.Automation, SSMAdapter = _f.SSMAdapter;
var _g = require('./services'), Services = _g.Services, CloudmapAdapter = _g.CloudmapAdapter;
var cloudmapAdapter = new CloudmapAdapter(serviceDiscovery);
var services = new Services(cloudmapAdapter);
var sqsQueue = new SQS(sqs);
var queue = new Queue(sqsQueue);
var snsPublisher = new SNS(sns);
var publisher = new Publisher(snsPublisher);
var lambdaAdapter = new LambdaAdapter(lambda);
var func = new Func(lambdaAdapter);
var stateMachineAdapter = new StepFunctionAdapter(stateMachine);
var stateMachineTrigger = new StateMachine(stateMachineAdapter);
var ssmAdapter = new SSMAdapter(ssm);
var automation = new Automation(ssmAdapter);
var runService = function (service, body, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = service.attributes, type = _a.type, arn = _a.arn, url = _a.url;
    switch (type) {
        case 'cloud-function':
        case 'function':
        case 'lambda': {
            return func.call(arn, body, opts);
        }
        case 'step-function':
        case 'state-machine': {
            return stateMachineTrigger.start(arn, body);
        }
        case 'script':
        case 'automation': {
            return automation.run(arn, body, opts);
        }
        case 'queue':
        case 'sqs': {
            if (opts.subscribe) {
                return queue.listen(url);
            }
            return queue.send(url, body, omit(['subscribe'], opts));
        }
        case 'event':
        case 'pubsub':
        case 'sns': {
            return publisher.publish(arn, body, omit(['subscribe'], opts));
        }
        default: {
            return Promise.resolve(null);
        }
    }
};
var callService = function (_a) {
    var _b = _a === void 0 ? {} : _a, namespace = _b.namespace, service = _b.service, instance = _b.instance, body = _b.body, opts = _b.opts;
    return services.find(namespace || defaultNamespace(), service, instance)
        .then(function (foundInstance) {
        if (!foundInstance) {
            throw new Error("couldn't find a service with instance id or instance name: " + instance);
        }
        return runService(foundInstance, body, opts)
            .then(function (payload) {
            if (payload && payload.errorMessage && payload.errorType) {
                throw payload;
            }
            return payload;
        });
    });
};
var request = function (serviceID, body, opts) {
    var _a = extractServiceParts(serviceID), namespace = _a.namespace, service = _a.service, instance = _a.instance;
    return callService({
        namespace: namespace,
        instance: instance,
        service: service,
        body: body,
        opts: opts,
    });
};
var publish = function (serviceID, body, opts) {
    var _a = extractServiceParts(serviceID), namespace = _a.namespace, service = _a.service, instance = _a.instance;
    return callService({
        namespace: namespace,
        service: service,
        instance: instance,
        body: body,
        opts: __assign({ subscribe: false }, opts),
    });
};
var subscribe = function (serviceID, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = extractServiceParts(serviceID), namespace = _a.namespace, service = _a.service, instance = _a.instance;
    return callService({
        namespace: namespace,
        service: service,
        instance: instance,
        opts: __assign({ subscribe: true }, opts),
    });
};
module.exports = {
    call: callService,
    // Synchronous
    request: request,
    // Events
    publish: publish,
    subscribe: subscribe,
    // Queue: these use the same functions as
    // events, until the discover function is called
    // and we know whether it's a queue or an event listener.
    queue: publish,
    listen: subscribe,
};
