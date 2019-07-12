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
    const { Payload, StatusCode } = await this.client.invoke(params).promise();
    return Payload ? JSON.parse(Payload) : StatusCode;
  }
}

module.exports = LambdaAdapter;
