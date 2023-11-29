import { MessageAttributeValue, SNS as AWSSNS } from '@aws-sdk/client-sns';
import {
  IPubSubAdapter,
  Request,
  ServiceResponse,
  Opts,
  PubSubResponse,
} from '../../types';

class SNS implements IPubSubAdapter {
  private client: AWSSNS;

  constructor(client: AWSSNS) {
    this.client = client;
  }

  private convertAttributes(
    opts: Opts = {},
  ): Record<string, MessageAttributeValue> {
    const kv = Object.entries(opts);
    return kv.reduce((a, b) => {
      const [key, value] = b;
      return {
        ...a,
        [key]: value,
      };
    }, {});
  }

  public async publish(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    try {
      const response = await this.client.publish({
        TopicArn: service.rid,
        Message: JSON.stringify(request.body),
        MessageAttributes: this.convertAttributes(opts),
      });

      if (!response.MessageId) {
        throw new Error('Missing message ID in response');
      }

      return {
        messageId: response.MessageId,
      };
    } catch (err) {
      // Handle the error appropriately
      throw new Error(`Failed to publish to SNS topic: ${err}`);
    }
  }

  public async subscribe(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    let protocol = 'http';
    if (opts && opts['protocol']) {
      protocol = opts['protocol'] as string;
    }

    try {
      const response = await this.client.subscribe({
        TopicArn: service.rid,
        Protocol: protocol,
      });

      if (!response.SubscriptionArn) {
        throw new Error('Missing subscription ARN in response');
      }

      return {
        rid: response.SubscriptionArn,
      };
    } catch (err) {
      // Handle the error appropriately
      throw new Error(`Failed to subscribe to SNS topic: ${err}`);
    }
  }
}

export default SNS;
