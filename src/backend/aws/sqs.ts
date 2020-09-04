import AWS from 'aws-sdk';
import {
  Opts,
  Request,
  IMessage,
  QueueResponse,
  IQueueAdapter,
  ServiceResponse,
} from '../../types';

const DEFAULT_INTERVAL = 10;

type SQSOpts = {
  interval: number;
};

class SQS implements IQueueAdapter {
  private readonly client: AWS.SQS;
  private opts?: SQSOpts;

  constructor(client: AWS.SQS, opts?: SQSOpts) {
    this.client = client;
    this.opts = opts;
  }

  public async queue(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<QueueResponse> {
    const res = await this.client
      .sendMessage({
        QueueUrl: service.rid,
        MessageBody: JSON.stringify(request),
        ...opts,
      })
      .promise();

    const id = res.MessageId;

    if (!id) {
      throw new Error('no message id in response from sqs');
    }

    return {
      id,
    };
  }

  public async listen(
    service: ServiceResponse,
    opts?: Opts,
  ): Promise<IMessage | null> {
    const { Messages } = await this.client
      .receiveMessage({
        QueueUrl: service.rid,
        WaitTimeSeconds:
          (opts?.interval as number) || this.opts?.interval || DEFAULT_INTERVAL,
      })
      .promise();
    if (!Messages) return null;
    const [message] = Messages;

    if (!message.Body || message.MessageId || !message.ReceiptHandle) {
      return null;
    }

    return {
      message: message.Body,
      messageId: message.MessageId as string,
      delete: this.delete(message.ReceiptHandle, service.rid),
    };
  }

  public delete(receipt: string, url: string): () => Promise<void> {
    return async () => {
      await this.client
        .deleteMessage({
          QueueUrl: url,
          ReceiptHandle: receipt,
        })
        .promise();
    };
  }
}

export default SQS;
