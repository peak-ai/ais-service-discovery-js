# Cloud Application Framework

![logo](logo.png)

## Description
This repository interfaces Serice Discovery, in this instance CloudMap, in order to locate and communicate with different services. As opposed to storing ARN's in environment variables, this library will interface CloudMap to find a service by a user friendly naming convention, and will understand what 'type' of service you've requested, and use the correct code to communicate/call that service.

## Services supported

- Lambda (`request`|`call`).
- SNS (`publish`). // subscribe not supported by SNS.
- SQS (`queue`|`listen`),

## TODO

- Http (`request`|`call`).
- Fargate/ECS Task (`run`).

## Note:

This library requires *Node 8 and above*. Node 6 and below will soon be EOL and unsupported.

## Examples:

### Import

```javascript
const ServiceDiscovery = require('@peak-ai/ais-service-discovery');
```

### Call a function

```javascript
await ServiceDiscovery.call({
  namespace,
  service,
  handler,
  body: {
    ...stuff
  },
});

// Or...
await ServiceDiscovery.call('namespace.service->handler',  body);
```

### Publish an SNS event

```javascript
await ServiceDiscovery.publish('namspace.topic', event, opts);
```

### Add message to queue
```javascript
await ServiceDiscovery.queue('namespace.queue-name', message, opts // optional);
```

### List to queue
```javascript
const messages = await ServiceDiscovery.listen('namespace.queue-name', opts // optional);
messages.on('message', (message) => {

});
```

### Register a service (Cloudformation)
```yaml
CloudMapService:
  Type: AWS::ServiceDiscovery::Service
  Properties:
    Description: discover handlers for ais-service-segment-explorer
    Name: segment-explorer
    NamespaceId: ${cf:ais-${opt:stage}-service-discovery.NamespaceId}

CreateRefreshSegmentInstance:
  Type: "AWS::ServiceDiscovery::Instance"
  Properties:
    InstanceAttributes:
      arn: ${self:service}-${opt:stage}-refresh-segment
      handler: refresh-segment
      type: function
    InstanceId: refresh-segment
    ServiceId:
      Ref: CloudMapService
```
