'use strict';

class LambdaAdapter {
  constructor(client) {
    this.client = client;
  }

  async call(name, body, opts) {
    const params = {
      ...opts,
      FunctionName: name,
      Payload: JSON.stringify(body),
    };
    const { Payload, StatusCode } = await this.client.invoke(params);

     // Convert Uint8Array to String
     const decoder = new TextDecoder('utf-8');
     const resString = decoder.decode(Payload);

    return Payload ? JSON.parse(resString) : StatusCode;
  }
}

module.exports = LambdaAdapter;
