'use strict';

const { SendCommandCommand } = require('@aws-sdk/client-ssm');

class SSMAdapter {
  constructor(client) {
    this.client = client;
  }

  run(name, body, params) {
    const ssmParams = {
      DocumentName: name,
      InstanceIds: body.instanceIds,
    };

    if (params) {
      ssmParams.Parameters = params;
    }

    const command = new SendCommandCommand(ssmParams);
    // send() returns a Promise, maintaining the async nature of the original method
    return this.client.send(command);
  }
}

module.exports = SSMAdapter;
