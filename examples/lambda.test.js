const { WithAwsBackend } = require('../dist');
const scenarios = require('./scenarios');
const ServiceDiscovery = require('../dist');

describe('(v3:Lambda)', () => {
	it('should get a response from a lambda', async () => {
    const sd = WithAwsBackend();
    const response = await scenarios.makeRequest(sd);
    expect(response.body).toEqual('test');
	});
});

describe('(v2:Lambda)', () => {
  it('should get a response from a lambda', async () => {
    const response = await scenarios.makeRequest(ServiceDiscovery);
    expect(response.body).toEqual('test');
  });
});
