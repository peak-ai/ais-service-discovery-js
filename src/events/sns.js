'use strict';

class SNS {
  constructor(client) {
    this.client = client;
  }

  async publish(name, event, attributes) {
    const { MessageId } = await this.client.publish({
      TopicArn: name,
      Message: JSON.stringify(event),
      MessageAttributes: attributes,
    });
    return MessageId;
  }

  subscribe(name) {
    return this.client.subscribe({
      TopicArn: name,
    });
  }
}

module.exports = SNS;
