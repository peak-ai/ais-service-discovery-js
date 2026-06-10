'use strict';

const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');

const DEFAULT_IDLE_TIMEOUT_MS = 30_000;
const DEFAULT_CONNECTION_TIMEOUT_MS = 8_000;
const DEFAULT_SOCKET_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_SOCKETS = 50;
const DEFAULT_MAX_ATTEMPTS = 3;

function buildHttpsAgent({ maxSockets = DEFAULT_MAX_SOCKETS, idleTimeoutMs = DEFAULT_IDLE_TIMEOUT_MS } = {}) {
  return new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 1000,
    timeout: idleTimeoutMs,
    maxSockets,
    scheduling: 'lifo',
  });
}

function buildClientConfig({
  maxSockets = DEFAULT_MAX_SOCKETS,
  idleTimeoutMs = DEFAULT_IDLE_TIMEOUT_MS,
  connectionTimeoutMs = DEFAULT_CONNECTION_TIMEOUT_MS,
  socketTimeoutMs = DEFAULT_SOCKET_TIMEOUT_MS,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
} = {}) {
  return {
    requestHandler: new NodeHttpHandler({
      httpsAgent: buildHttpsAgent({ maxSockets, idleTimeoutMs }),
      connectionTimeout: connectionTimeoutMs,
      socketTimeout: socketTimeoutMs,
    }),
    maxAttempts,
    retryMode: 'adaptive',
  };
}

function makeAwsClient(ClientCtor, overrides = {}) {
  return new ClientCtor(buildClientConfig(overrides));
}

module.exports = {
  buildHttpsAgent,
  buildClientConfig,
  makeAwsClient,
  DEFAULT_IDLE_TIMEOUT_MS,
  DEFAULT_CONNECTION_TIMEOUT_MS,
  DEFAULT_SOCKET_TIMEOUT_MS,
  DEFAULT_MAX_SOCKETS,
  DEFAULT_MAX_ATTEMPTS,
};
