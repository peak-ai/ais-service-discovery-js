import AWS from 'aws-sdk';
import {
  IFunctionAdapter,
  Opts,
  ServiceResponse,
  Request,
  Response,
} from '../../types';

class LambdaAdapter implements IFunctionAdapter {
  private client: AWS.Lambda;

  constructor(client: AWS.Lambda) {
    this.client = client;
  }

  async request(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<Response> {
    const params = {
      ...opts,
      FunctionName: service.rid,
      Payload: JSON.stringify(request.body),
    };
    const { Payload, StatusCode } = await this.client.invoke(params).promise();
    return Payload ? JSON.parse(Payload.toString()) : StatusCode;
  }
}

export default LambdaAdapter;
