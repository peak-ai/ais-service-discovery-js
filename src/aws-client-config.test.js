'use strict';

const https = require('https');
const {
  buildHttpsAgent,
  buildClientConfig,
  makeAwsClient,
  DEFAULT_IDLE_TIMEOUT_MS,
  DEFAULT_MAX_SOCKETS,
  DEFAULT_MAX_ATTEMPTS,
} = require('./aws-client-config');

describe('aws-client-config', () => {
  describe('buildHttpsAgent', () => {
    it('returns an https.Agent with keep-alive enabled and a finite idle timeout', () => {
      const agent = buildHttpsAgent();

      expect(agent).toBeInstanceOf(https.Agent);
      expect(agent.keepAlive).toBe(true);
      expect(agent.keepAliveMsecs).toBe(1000);
      expect(agent.options.timeout).toBe(DEFAULT_IDLE_TIMEOUT_MS);
      expect(agent.maxSockets).toBe(DEFAULT_MAX_SOCKETS);
      expect(agent.scheduling).toBe('lifo');
    });

    it('honors maxSockets and idleTimeoutMs overrides', () => {
      const agent = buildHttpsAgent({ maxSockets: 10, idleTimeoutMs: 5_000 });

      expect(agent.maxSockets).toBe(10);
      expect(agent.options.timeout).toBe(5_000);
    });
  });

  describe('buildClientConfig', () => {
    it('returns a config with adaptive retry and bounded attempts', () => {
      const config = buildClientConfig();

      expect(config.retryMode).toBe('adaptive');
      expect(config.maxAttempts).toBe(DEFAULT_MAX_ATTEMPTS);
      expect(config.requestHandler).toBeDefined();
    });
  });

  describe('makeAwsClient', () => {
    it('passes the shared config into the SDK client constructor', () => {
      const received = [];
      class FakeClient {
        constructor(cfg) {
          received.push(cfg);
        }
      }

      makeAwsClient(FakeClient);
      makeAwsClient(FakeClient, { maxSockets: 5 });

      expect(received).toHaveLength(2);
      expect(received[0].retryMode).toBe('adaptive');
      expect(received[0].maxAttempts).toBe(DEFAULT_MAX_ATTEMPTS);
      expect(received[1].requestHandler).toBeDefined();
    });
  });
});
