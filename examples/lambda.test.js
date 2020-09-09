const { WithAwsBackend } = require('../dist');

describe('(Integration:Lambda)', () => {
	it('should get a response from a lambda', async () => {
		try {
			const sd = WithAwsBackend();
			const request = {
				body: {},
			};
			const response = await sd.request('test-namespace.test-service->my-func-instance', request, {})
			expect(response.body).toEqual('test');
		} catch (e) {
			console.error(e);
		}
	})
});
