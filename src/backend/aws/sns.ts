import AWS from 'aws-sdk';
import {
  IPubSubAdapter,
  Request,
  ServiceResponse,
  Opts,
  PubSubResponse,
} from '../../types';

class SNS implements IPubSubAdapter {
  private client: AWS.SNS;

  constructor(client: AWS.SNS) {
    this.client = client;
  }

  convertAttributes(opts?: Opts): AWS.SNS.MessageAttributeMap {
    if (!opts) return {};
    const kv = Object.entries(opts);
    return kv.reduce((a, b) => {
      const [key, value] = b;
      return {
        ...a,
        [key]: value,
      };
    }, {});
  }

  async publish(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    const { MessageId } = await this.client
      .publish(
        {
          TopicArn: service.rid,
          Message: JSON.stringify(request.body),
          MessageAttributes: this.convertAttributes(opts),
        },
        () => {},
      )
      .promise();

    if (!MessageId) {
      throw new Error('missing message id in response');
    }

    return {
      messageId: MessageId,
    };
  }

  async subscribe(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<PubSubResponse> {
    let protocol = 'http';
    if (opts && opts['protocol']) {
      protocol = opts['protocol'] as string;
    }

    const response = await this.client
      .subscribe(
        {
          TopicArn: service.rid,
          Protocol: protocol,
        },
        () => {},
      )
      .promise();

    return {
      rid: response.SubscriptionArn,
    };
  }
}

export default SNS;
