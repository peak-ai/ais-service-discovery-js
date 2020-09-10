import { WithMockBackend } from './mock';
import { IMessage, IQueueAdapter } from '../../types';
import Poller from '../../poller/poller';

describe('(Mock Backend)', () => {
  it('can make a request', async () => {
    const response = JSON.stringify({ hello: 'world' });
    const config = {
      'latest.service->my-func': {
        type: 'function',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const request = { body: 'test' };
    const sd = WithMockBackend(config);
    const actual = await sd.request('latest.service->my-func', request, {});
    expect(actual.body).toBe(response);
  });

  it('can queue a message', async () => {
    const response = 'abc123';
    const config = {
      'latest.service->my-queue': {
        type: 'queue',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: 'test' };
    const actual = await sd.queue('latest.service->my-queue', request, {});
    expect(actual.id).toBe(response);
  });

  it('can subscribe to a queue', async () => {
    const response = 'message';
    const config = {
      'latest.service->my-queue': {
        type: 'queue',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const results = await sd.listen('latest.service->my-queue');
    const listen = (results: Poller<IQueueAdapter>) =>
      new Promise((resolve, reject) => {
        results.on('message', (message: IMessage | null) => {
          results.stop();
          if (message) {
            resolve(message);
            return;
          }

          reject(new Error('no message found'));
        });
      });

    const result = await listen(results);
    expect((result as IMessage)?.message).toBe(response);
  });

  it('can publish an event', async () => {
    const response = 'message-id';
    const config = {
      'latest.service->my-topic': {
        type: 'pubsub',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: 'Test' };
    const actual = await sd.publish('latest.service->my-topic', request, {});
    expect(actual.messageId).toBe(response);
  });

  it('should subscribe to an event', async () => {
    const response = 'message';
    const config = {
      'latest.service->my-topic': {
        type: 'pubsub',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: 'Test' };
    const actual = await sd.publish('latest.service->my-topic', request, {});
    expect(actual.messageId).toBe(response);
  });
});
