import { WithAwsBackend } from '../src';
import * as scenarios from './scenarios';
import * as ServiceDiscovery from '../src';

const QUEUE_AND_LISTEN = 'should queue a message and listen for the result';

describe('(v3:Queue:SQS)', () => {
  it(QUEUE_AND_LISTEN, async () => {
    const sd = WithAwsBackend();
    const request = 'hello world';
    await scenarios.queueMessage(sd, request);
    const result = await scenarios.listenForMessage(sd);
    expect(result).toEqual(request);
  });
});

describe('(v2:Queue:SQS)', () => {
  it(QUEUE_AND_LISTEN, async () => {
    const request = 'hello world';
    await scenarios.queueMessageLegacy(ServiceDiscovery, request);
    const result = await scenarios.listenForMessage(ServiceDiscovery);
    expect(result).toEqual(request);
  });
});