import { SQS as AWSSQS } from '@aws-sdk/client-sqs';
import {
  Opts,
  Request,
  IMessage,
  IEventHandler,
  QueueResponse,
  IQueueAdapter,
  ServiceResponse,
} from '../../types';

const DEFAULT_INTERVAL = 10;

type SQSOpts = {
  interval: number;
};

class SQS implements IQueueAdapter {
  private readonly client: AWSSQS;
  private opts?: SQSOpts;

  constructor(client: AWSSQS, opts?: SQSOpts) {
    this.client = client;
    this.opts = opts;
  }

  public async send(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<QueueResponse> {
    const res = await this.client.sendMessage({
      QueueUrl: service.rid,
      MessageBody: JSON.stringify(request),
      ...opts,
    });

    const id = res.MessageId;

    if (!id) {
      throw new Error('no message id in response from sqs');
    }

    return { id };
  }

  public async listen(
    service: ServiceResponse,
    opts?: Opts,
  ): Promise<IMessage | null> {
    const { Messages } = await this.client.receiveMessage({
      QueueUrl: service.rid,
      WaitTimeSeconds:
        (opts?.interval as number) || this.opts?.interval || DEFAULT_INTERVAL,
    });
    if (!Messages) return null;
    const [message] = Messages;

    if (
      [message.Body, message.MessageId, message.ReceiptHandle].some(
        (a) => a === null,
      )
    ) {
      return null;
    }

    return {
      id: message.MessageId as string,
      message: message.Body as string,
      delete: this.delete(message.ReceiptHandle as string, service.rid),
    };
  }

  public delete(receipt: string, url: string): () => Promise<void> {
    return async () => {
      await this.client.deleteMessage({
        QueueUrl: url,
        ReceiptHandle: receipt,
      });
    };
  }
}

export default SQS;
