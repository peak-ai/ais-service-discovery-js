'use strict';

const DEFAULT_INTERVAL = 10;
class SQS {
  constructor(client, opts = {}) {
    this.client = client;
    this.opts = opts;
  }

  send(name, event, opts = {}) {
    return this.client.sendMessage({
      QueueUrl: name,
      MessageBody: JSON.stringify(event),
      ...opts,
    });
  }

  async listen(name) {
    const { Messages } = await this.client.receiveMessage({
      QueueUrl: name,
      WaitTimeSeconds: this.opts.interval || DEFAULT_INTERVAL,
    });
    if (!Messages) return null;
    const [message] = Messages;
    return {
      message: message.Body,
      messageId: message.MessageId,
      delete: this.delete(message.ReceiptHandle, name),
    };
  }

  delete(receipt, url) {
    return () => this.client.deleteMessage({
      QueueUrl: url,
      ReceiptHandle: receipt,
    });
  }
}

module.exports = SQS;
