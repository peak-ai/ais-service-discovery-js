'use strict';

const AWS = require('aws-sdk');
const sd = new AWS.ServiceDiscovery();

class CloudmapAdapter {
  constructor(client) {
    this.client = client;
  }

  discover(namespace, name, queryParams) {
    const params = {
      NamespaceName: namespace,
      ServiceName: name,
      QueryParameters: queryParams,
    };
    return this.client.discoverInstances(params).promise();
  }

  async find(namespace, service, instance) {
    const res = await this.discover(namespace, service, {});
    return res.Instances.find(item => item.InstanceId === instance);
  }
}

const cm = new CloudmapAdapter(sd);

const discover = async () => {
  console.time('test');
  const res = await cm.discover('ais-latest', 'segment-explorer', { InstanceId: 'refresh-segment' });
  console.timeEnd('test');
  res.Instances.map(item => console.log(item));
  return res;
};

const find = async () => {
  console.time('test');
  const res = await cm.find('ais-latest', 'query-runner', 'cancellation-queue');
  console.timeEnd('test');
  return res;
};

find().then(console.log).catch(console.error);
