'use strict';

const { Lambda } = require('@aws-sdk/client-lambda');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const https = require('https');

class LambdaAdapter {
  constructor(client) {
    this.client = client;
    this.clientCache = new Map();
  }

  getClient(maxSockets) {
    if (this.clientCache.has(maxSockets)) {
      return this.clientCache.get(maxSockets);
    }
    const client = new Lambda({
      requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          keepAlive: true,
          maxSockets,
        }),
        connectionTimeout: 8000,
        socketTimeout: 8000,
      }),
      maxAttempts: 3,
      retryMode: 'adaptive',
    });
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
