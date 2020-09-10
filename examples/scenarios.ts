import Backend from '../src/backend/backend';
import { Request, Response } from '../src/types';
import { ServiceDiscovery } from 'aws-sdk';

export const makeRequest = (sd: Backend, body = ''): Promise<Response> => {
  const request = { body };
  return sd.request(
    'test-namespace.test-service->my-func-instance',
    request,
    {},
  );
};

const expectUUID = (u: string) =>
  expect(u).toEqual(
    expect.stringMatching(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    ),
  );

export const queueMessage = async (sd: Backend, message: Request) => {
  const response = await sd.queue(
    'test-namespace.test-service->my-queue-instance',
    message,
  );

  expectUUID(response.id);
  return response;
};

// @ts-ignore
export const queueMessageLegacy = async (sd: any, message: Request) => {
  const response = await sd.queue(
    'test-namespace.test-service->my-queue-instance',
    message,
  );

  // Expect a UUID
  expectUUID(response.MessageId);

  return response;
};

export const listenForMessage = async (sd: Backend) => {
  const results = await sd.listen(
    'test-namespace.test-service->my-queue-instance',
  );

  const listen = (results) =>
    new Promise((resolve, _) => {
      results.on('message', (message) => {
        results.stop();
        message.delete(message.id);
        const m = JSON.parse(message.message);
        resolve(m);
      });
    });

  return await listen(results);
};

export default {
  makeRequest,
  queueMessage,
};
