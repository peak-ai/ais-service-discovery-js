import { ServiceResponse } from "../../types";
import aws from "aws-sdk";

class CloudmapAdapter {
  private client = '';

  constructor(client) {
    this.client = client;
  }

  /*
   * Discover will find multiple instances by a specified
   * object containing metadata registered against an instance.
   */
  discover(namespace, service, queryParams = {}) {
    const params = {
      NamespaceName: namespace,
      ServiceName: service,
      QueryParameters: queryParams,
    };
    return this.client.discoverInstances(params).promise();
  }

  /**
   * Finds a single instance by id.
   */
  async find(namespace: string, service: string, instance: string, params = {}): ServiceResponse {
    const res = await this.discover(namespace, service, params);
    const i = res.Instances.find(item => item.InstanceId === instance);
    if (!i) throw new Error(`no service found: ${namespace}.${service}->${instance}`);
    return {
      id: instance,
      attributes: i.Attributes,
    };
  }
}

export default CloudmapAdapter;
