const { WithAwsBackend } = require('../dist');

function main() {
	try {
		const sd = WithAwsBackend();
		const request = {
			body: JSON.stringify({
				hello: 'world',
			}),
		};
		return sd.request('test-namespace.test-service->my-func-instance', request, {})
			.then(response => console.log(response))
			.catch(console.error);
	} catch (e) {
		console.error(e);
	}
}

main();
