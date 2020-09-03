import {
  Opts,
  ServiceResponse,
  IDiscoverAdapter,
  ServiceRequest, Attributes,
} from "../../types";

import AWS from "aws-sdk";

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
      }
    }, {});
  }

  /*
   * Discover will find multiple instances by a specified
   * object containing metadata registered against an instance.
   */
  private discover(namespace:string, service: string, opts?: Opts): Promise<AWS.ServiceDiscovery.DiscoverInstancesResponse> {
    const params = {
      NamespaceName: namespace,
      ServiceName: service,
      QueryParameters: this.toParams(opts),
    };
    return this.client.discoverInstances(params, () => {}).promise();
  }

  public async locate(serviceRequest: ServiceRequest, opts?: Opts): Promise<ServiceResponse> {
    const { namespace, service, instance } = serviceRequest;
    const res = await this.discover(namespace, service, opts);
    if (!res?.Instances) throw new Error(`no service found: ${namespace}.${service}->${instance}`);

    const i = res.Instances.find(item => item.InstanceId === instance);
    if (!i) {
      throw new Error('no valid instance found with given instance id');
    }

    return {
      rid: instance,
      attributes: i.Attributes,
    };
  }
}

export default CloudmapAdapter;
