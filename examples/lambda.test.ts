import { WithAwsBackend } from '../src';
import * as scenarios from './scenarios';
import * as ServiceDiscovery from '../src';

describe('(v3:Function:Lambda)', () => {
  it('should get a response from a lambda', async () => {
    const sd = WithAwsBackend();
    const response = await scenarios.makeRequest(sd);
    expect(response.body).toEqual('test');
  });
});

describe('(v2:Function:Lambda)', () => {
  it('should get a response from a lambda', async () => {
    const response = await scenarios.makeRequest(ServiceDiscovery);
    expect(response.body).toEqual('test');
  });
});
