// @ts-ignore
import {
  call,
  request,
  publish,
  subscribe,
  queue,
  listen,
} from "./call-service";

// Beta api -
import ServiceDiscovery from "./backend/backend";
import { WithMockBackend } from "./backend/mock/mock";
import { WithAwsBackend } from "./backend/aws/aws";

export {
  call,
  request,
  publish,
  subscribe,
  queue,
  listen,

  // Beta api
  ServiceDiscovery,
  WithMockBackend,
  WithAwsBackend,
};
