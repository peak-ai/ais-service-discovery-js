'use strict';

class CloudmapAdapter {
  constructor(client) {
    this.client = client;
  }

  discover(namespace, name, handler) {
    const params = {
      NamespaceName: namespace,
      ServiceName: name,
      QueryParameters: {
        handler,
      },
    };
    return this.client.discoverInstances(params).promise();
  }
}

module.exports = CloudmapAdapter;
