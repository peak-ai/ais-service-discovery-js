import { Config } from './types';
import DefaultAddressParser from '../../address-parser/default';
import QueueAdapter from './queue';
import FunctionAdapter from './function';
import RegistryAdapter from './registry';
import PubSubAdapter from './pubsub';
import Backend from '../backend';
import Poller from "../../poller/poller";

// Convenience factory function
export function WithMockBackend(config: Config) {
  return new Backend(
    new DefaultAddressParser(),
    new RegistryAdapter(config),
    new Poller(new QueueAdapter(config)),
    new FunctionAdapter(config),
    new PubSubAdapter(config),
  );
}
