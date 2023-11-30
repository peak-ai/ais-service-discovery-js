'use strict';
const { Lambda: AWSLambda} = require('@aws-sdk/client-lambda')
const { SQS: AWSSQS} = require('@aws-sdk/client-sqs')
const { SNS: AWSSNS} = require('@aws-sdk/client-sns')
const { SSM: AWSSSM} = require('@aws-sdk/client-ssm')
const {SFNClient} = require('@aws-sdk/client-sfn')
const { ServiceDiscovery: AWSServiceDiscovery} = require('@aws-sdk/client-servicediscovery')



const { omit } = require('ramda');

const { defaultNamespace, extractServiceParts } = require('./helpers/call-service-helper');

const lambda = new AWSLambda();
const sqs = new AWSSQS();
const sns = new AWSSNS();
const ssm = new AWSSSM();
const stateMachine = new SFNClient();
const serviceDiscovery = new AWSServiceDiscovery();

const { SNS, Publisher } = require('./events');
const { SQS, Queue } = require('./queue');
const { Func, LambdaAdapter } = require('./functions');
const { StateMachine, StepFunctionAdapter } = require('./state-machine');
const { Automation, SSMAdapter } = require('./automation');
const { CloudmapAdapter, Services } = require('./services');


const cloudmapAdapter = new CloudmapAdapter(serviceDiscovery);
const services = new Services(cloudmapAdapter);

const sqsQueue = new SQS(sqs);
const queue = new Queue(sqsQueue);

const snsPublisher = new SNS(sns);
const publisher = new Publisher(snsPublisher);

const lambdaAdapter = new LambdaAdapter(lambda);
const func = new Func(lambdaAdapter);

const stateMachineAdapter = new StepFunctionAdapter(stateMachine);
const stateMachineTrigger = new StateMachine(stateMachineAdapter);

const ssmAdapter = new SSMAdapter(ssm);
const automation = new Automation(ssmAdapter);

const maybe = (rid, other) => (rid) ? rid : other;

const runService = (service, body, opts = {}) => {
  const { type, arn, rid, url } = service.attributes;

  switch (type) {
    case 'cloud-function':
    case 'function':
    case 'lambda': {
      return func.call(maybe(rid, arn), body, opts);
    }

    case 'step-function':
    case 'state-machine': {
      return stateMachineTrigger.start(maybe(rid, arn), body);
    }

    case 'script':
    case 'automation': {
      return automation.run(maybe(rid, arn), body, opts);
    }

    case 'queue':
    case 'sqs': {
      if (opts.subscribe) {
        return queue.listen(maybe(rid, url));
      }
      return queue.send(maybe(rid, url), body, omit(['subscribe'], opts));
    }

    case 'event':
    case 'pubsub':
    case 'sns': {
      return publisher.publish(maybe(rid, arn), body, omit(['subscribe'], opts));
    }

    default: {
      return Promise.resolve(null);
    }
  }
};

const callService = ({
  namespace,
  service,
  instance,
  body,
  opts,
} = {}) => services.locate(namespace || defaultNamespace(), service, instance)
  .then((foundInstance) => {
    if (!foundInstance) {
      throw new Error(`couldn't find a service with instance id or instance name: ${instance}`);
    }

    return runService(foundInstance, body, opts)
      .then((payload) => {

        if (payload && payload.errorMessage && payload.errorType) {
          throw payload;
        }
        return payload;
      });
  });

const request = (serviceID, body, opts) => {
  const { namespace, service, instance } = extractServiceParts(serviceID);
  return callService({
    namespace,
    instance,
    service,
    body,
    opts,
  });
};

const publish = (serviceID, body, opts) => {
  const { namespace, service, instance } = extractServiceParts(serviceID);
  return callService({
    namespace,
    service,
    instance,
    body,
    opts: { subscribe: false, ...opts },
  });
};

const subscribe = (serviceID, opts = {}) => {
  const { namespace, service, instance } = extractServiceParts(serviceID);
  return callService({
    namespace,
    service,
    instance,
    opts: { subscribe: true, ...opts },
  });
};

module.exports = {
  call: callService,

  // Synchronous
  request,

  // Events
  publish,
  subscribe,

  // Queue: these use the same functions as
  // events, until the discover function is called
  // and we know whether it's a queue or an event listener.
  queue: publish,
  listen: subscribe,
};
