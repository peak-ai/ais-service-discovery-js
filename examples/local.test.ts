import { WithMockBackend } from '../src';

describe('(Local Backend)', () => {
  it('should', async () => {
    const config = {
      'namespace.service->instance': {
        type: 'function',
        resolve: {
          mockedResponse: 'This is a test',
        },
      },
    };
    const sd = WithMockBackend(config);

    const request = {
      body: JSON.stringify({
        hello: 'world',
      }),
    };
    const response = await sd.request(
      'namespace.service->instance',
      request,
      {},
    );
    expect(response.body).toEqual('This is a test');
  });
});
