'use strict';

class SSMAdapter {
  constructor(client) {
    this.client = client;
  }

  run(name, body, params) {
    const ssmParams = {
      DocumentName: name,
      InstanceIds: body.instanceIds,
    };
    if (params) ssmParams.Parameters = params;
    return this.client.sendCommand(ssmParams).promise();
  }
}

module.exports = SSMAdapter;
