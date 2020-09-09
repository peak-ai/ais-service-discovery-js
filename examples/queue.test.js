const { WithAwsBackend } = require('../dist');

let sd;
beforeEach(() => {
  sd = WithAwsBackend();
})

describe('(Queue:SQS)', () => {
  it('should queue a message and listen for the result', async () => {
    try {
      
      const request = 'hello world';  
      const response = await sd.queue('test-namespace.test-service->my-queue-instance', request);
 
      expect(response.id).toEqual(expect.stringMatching(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/));
      const results = await sd.listen('test-namespace.test-service->my-queue-instance');

      const listen = (results) => new Promise((resolve, reject) => {
        results.on('message', message => {
          message.delete(message.id);
          const m = JSON.parse(message.message);
          resolve(m.body);
        });
      });

      const result = await listen(results);
      expect(result).toEqual('hello world');
    } catch (e) {
      console.error(e);
    }
  });
});
