import { WithAwsBackend } from '../dist';

(async() => {
	const sd = WithAwsBackend();
	const request = {
		body: JSON.stringify({
			hello: 'world',
		}),
	};
	const response = await sd.request('ais-latest.service->test', request);
	console.log(response.body);
})();
