import { WithAwsBackend } from '../src';
import * as scenarios from './scenarios';

describe('(Queue:SQS)', () => {
  it('should queue a message and listen for the result', async () => {
    const sd = WithAwsBackend();
    const request = 'hello world';
    await scenarios.queueMessage(sd, request);
    const result = await scenarios.listenForMessage(sd);
    expect(result).toEqual(request);
  });
});
