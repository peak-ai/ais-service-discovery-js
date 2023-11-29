'use strict';

class StepFunctionAdapter {
  constructor(client) {
    this.client = client;
  }

  async start(arn, body) {
    const params = {
      stateMachineArn: arn,
      input: JSON.stringify(body),
    };
    const result = await this.client.startExecution(params);
    return result;
  }
}

module.exports = StepFunctionAdapter;
