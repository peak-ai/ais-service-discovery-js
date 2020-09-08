const { WithAwsBackend } = require('../dist');

async function main() {
	try {
		const sd = WithAwsBackend();
		const request = {
			body: JSON.stringify({
				hello: 'world',
			}),
		};
		const response = await sd.request('test-namespace.test-service->my-func-instance', request, {})
		return response.body;
	} catch (e) {
		console.error(e);
	}
}

main().then(console.log).catch(console.error);
