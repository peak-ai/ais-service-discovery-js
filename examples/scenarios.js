const { Service } = require("aws-sdk");
const { ServiceDiscovery } = require("../dist");

const makeRequest = (sd, body = '') => {
  const request = { body };
  return sd.request('test-namespace.test-service->my-func-instance', request, {});
};

const queueMessage = (sd, message) => {

};

module.exports = {
  makeRequest,
};
