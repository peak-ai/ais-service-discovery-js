'use strict';

class SNS {
  constructor(client) {
    this.client = client;
  }

  async publish(name, event) {
    const { MessageId } = await this.client.publish({
      TopicArn: name,
      Message: JSON.stringify(event),
    }).promise();
    return MessageId;
  }

  subscribe(name) {
    return this.client.subscribe({
      TopicArn: name,
    }).promise();
  }
}

module.exports = SNS;
