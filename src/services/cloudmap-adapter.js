'use strict';

const { DiscoverInstancesCommand } = require('@aws-sdk/client-servicediscovery');

class CloudmapAdapter {
  constructor(client) {
    this.client = client;
  }

  toParams(opts = {}) {
    const o = Object.entries(opts);
    return o.reduce((a, b) => {
      const [key, value] = b;
      return { ...a, [key]: value.toString() };
    }, {});
  }

  discover(namespace, service, opts = {}) {
    const params = {
      NamespaceName: namespace,
      ServiceName: service,
      QueryParameters: this.toParams(opts),
    };

    const command = new DiscoverInstancesCommand(params);
    // send() returns a Promise, maintaining the async nature of the original method
    return this.client.send(command);
  }

  async locate(serviceRequest, opts = {}) {
    const { namespace, service, instance } = serviceRequest;

    const res = await this.discover(namespace, service, opts);
    if (!res || !res.Instances) {
      throw new Error(`no service found: ${namespace}.${service}->${instance}`);
    }

    const i = res.Instances.find(item => item.InstanceId === instance);
    if (!i) {
      throw new Error('no valid instance found with given instance id');
    }

    const attributes = i.Attributes;
    if (!attributes) {
      throw new Error('no attributes found, we need these to find a usable resource id');
    }

    const identifiers = [
      attributes['id'],
      attributes['arn'],
      attributes['url'],
      attributes['rid'],
    ];

    const rid = identifiers.find(a => a !== undefined);

    return {
      rid: rid,
      attributes: i.Attributes,
    };
  }
}

module.exports = CloudmapAdapter;
