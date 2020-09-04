import { WithMockBackend } from "./mock";

describe('(Mock Backend)', () => {
  test('can make a request', async () => {
    const response = JSON.stringify({ hello: "world" });
    const config = {
      'latest.service->my-func': {
        type: 'function',
        resolve: {
          mockedResponse: response,
        },
      },
    }

    const request = { body: "test" };
    const sd = WithMockBackend(config);
    const actual = await sd.request('latest.service->my-func', request, {});
    expect(actual.body).toBe(response);
  });

  test('can queue a message', async () => {
    const response = "abc123";
    const config = {
      'latest.service->my-queue': {
        type: 'queue',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: "test" };
    const actual = await sd.queue('latest.service->my-queue', request, {});
    expect(actual.id).toBe(response);
  });

  test('can subscribe to a queue', async () => {
    const response = "message";
    const config = {
      'latest.service->my-queue': {
        type: 'queue',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: "Test" };
    const actual = await sd.listen('latest.service->my-queue', request, {});
    expect(actual?.message).toBe(response);
  });

  test('can publish an event', async () => {
    const response = "message-id";
    const config = {
      'latest.service->my-topic': {
        type: 'pubsub',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: "Test" };
    const actual = await sd.publish('latest.service->my-topic', request, {});
    expect(actual.messageId).toBe(response);
  });

  it('should subscribe to an event', async () => {
    const response = "message";
    const config = {
      'latest.service->my-topic': {
        type: 'pubsub',
        resolve: {
          mockedResponse: response,
        },
      },
    };

    const sd = WithMockBackend(config);
    const request = { body: "Test" };
    const actual = await sd.publish('latest.service->my-topic', request, {});
    expect(actual.messageId).toBe(response);
  });
});
