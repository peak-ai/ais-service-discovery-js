import { Lambda } from '@aws-sdk/client-lambda';
import { ServiceDiscovery } from '@aws-sdk/client-servicediscovery';
import { SNS } from '@aws-sdk/client-sns';
import { SQS } from '@aws-sdk/client-sqs';
import Backend from '../backend';

import SNSAdapter from './sns';
import SQSAdapter from './sqs';
import LambdaAdapter from './lambda';
import CloudmapDiscoverAdapter from './cloudmap';
import DefaultAddressParser from '../../address-parser/default';
import Poller from '../../poller/poller';

// Convenience factory function
export function WithAwsBackend() {
  return new Backend(
    new DefaultAddressParser(),
    new CloudmapDiscoverAdapter(new ServiceDiscovery()),
    new Poller(new SQSAdapter(new SQS())),
    new LambdaAdapter(new Lambda()),
    new SNSAdapter(new SNS()),
  );
}
