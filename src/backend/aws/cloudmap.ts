import {
  Opts,
  ServiceResponse,
  IDiscoverAdapter,
  ServiceRequest,
} from '../../types';

import AWS from 'aws-sdk';

class CloudmapAdapter implements IDiscoverAdapter {
  private readonly client: AWS.ServiceDiscovery;

  constructor(client: AWS.ServiceDiscovery) {
    this.client = client;
  }

  private toParams(opts?: Opts): AWS.ServiceDiscovery.Attributes {
    if (!opts) {
      return {};
    }

    const o = Object.entries(opts);
    return o.reduce((a, b) => {
      const [key, value] = b;
      return {
        ...a,
        [key]: value as string,
      };
    }, {});
  }

  /*
   * Discover will find multiple instances by a specified
   * object containing metadata registered against an instance.
   */
  private discover(
    namespace: string,
    service: string,
    opts?: Opts,
  ): Promise<AWS.ServiceDiscovery.DiscoverInstancesResponse> {
    const params = {
      NamespaceName: namespace,
      ServiceName: service,
      QueryParameters: this.toParams(opts),
    };
    return this.client.discoverInstances(params).promise();
  }

  public async locate(
    serviceRequest: ServiceRequest,
    opts?: Opts,
  ): Promise<ServiceResponse> {
    const { namespace, service, instance } = serviceRequest;

    // Find the service
    const res = await this.discover(namespace, service, opts);
    if (!res?.Instances)
      throw new Error(`no service found: ${namespace}.${service}->${instance}`);

    // Filter down to the specific instance
    const i = res.Instances.find((item) => item.InstanceId === instance);
    if (!i) {
      throw new Error('no valid instance found with given instance id');
    }

    const attributes = i.Attributes;
    if (!attributes) {
      throw new Error(
        'no attributed found, we need these to find a usable resource id',
      );
    }

    // Create an array of all of the possible set ID's. We have to do this because initially we used
    // 'arn', then queues used 'url', then we decided we should try to use something agnostic, so
    // introduced 'rid' (resource id). But, in the interest of backwards compatibility, we should check them all.
    const identifiers = [
      attributes['id'],
      attributes['arn'],
      attributes['url'],
      attributes['rid'],
    ];

    // Find the id that's used, in theory this will just find the first from the above,
    // that isn't 'undefined', this could cause issues if people use multiple, or happen to use
    // one of those attribute values for something else.
    const rid = identifiers.find((a) => a !== undefined);

    return {
      rid: rid as string,
      attributes: i.Attributes,
    };
  }
}

export default CloudmapAdapter;
