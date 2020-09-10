export const makeRequest = (sd, body = '') => {
  const request = { body };
  return sd.request('test-namespace.test-service->my-func-instance', request, {});
};

export const queueMessage = (sd, message) => {

};

export default {
  makeRequest,
  queueMessage,
};
