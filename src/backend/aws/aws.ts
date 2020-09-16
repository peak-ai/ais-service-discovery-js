import * as AWS from 'aws-sdk';
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
    new CloudmapDiscoverAdapter(new AWS.ServiceDiscovery()),
    new Poller(new SQSAdapter(new AWS.SQS())),
    new LambdaAdapter(new AWS.Lambda()),
    new SNSAdapter(new AWS.SNS()),
  );
}
