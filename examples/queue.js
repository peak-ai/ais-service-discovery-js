const { WithAwsBackend } = require('../dist');

(async () => {
	try {
		const sd = WithAwsBackend();
		const request = {
			body: JSON.stringify({
				hello: 'world',
			}),
		};

		const response = await sd.queue('test-namespace.test-service->my-queue-instance', request);
		console.log(response);

		const results = await sd.listen('test-namespace.test-service->my-queue-instance');
		results.on('message', message => {
			console.log(message);
			message.delete(message.id);
		});
	} catch (e) {
		console.error(e);
	}
})();
