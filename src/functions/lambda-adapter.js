'use strict';

const { Lambda } = require('@aws-sdk/client-lambda');

const { makeAwsClient } = require('../aws-client-config');

class LambdaAdapter {
  constructor(client) {
    this.client = client;
    this.clientCache = new Map();
  }

  getClient(maxSockets) {
    if (this.clientCache.has(maxSockets)) {
      return this.clientCache.get(maxSockets);
    }
    const client = makeAwsClient(Lambda, { maxSockets });
    this.clientCache.set(maxSockets, client);
    return client;
  }

  async call(name, body, opts) {
    const { maxSockets, ...invokeOpts } = opts || {};
    const client = maxSockets ? this.getClient(maxSockets) : this.client;
    const params = {
      ...invokeOpts,
      FunctionName: name,
      Payload: JSON.stringify(body),
    };
    const { Payload, StatusCode } = await client.invoke(params);

    // Convert Uint8Array to String
    const decoder = new TextDecoder('utf-8');
    const resString = decoder.decode(Payload);

    return Payload ? JSON.parse(resString) : StatusCode;
  }
}

module.exports = LambdaAdapter;
