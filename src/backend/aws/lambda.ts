import AWS from 'aws-sdk';
import {
  Opts,
  Request,
  Response,
  ServiceResponse,
  IFunctionAdapter,
} from '../../types';

class LambdaAdapter implements IFunctionAdapter {
  private client: AWS.Lambda;

  constructor(client: AWS.Lambda) {
    this.client = client;
  }

  public async request(
    service: ServiceResponse,
    request: Request,
    opts?: Opts,
  ): Promise<Response> {
    const params = {
      ...opts,
      FunctionName: service.rid,
      Payload: JSON.stringify(request.body),
    };

    return {
      body: 'test',
    };
    // const { Payload: payload, StatusCode: statusCode } = await this.client.invoke(params).promise();
    // return payload ? JSON.parse(payload.toString()) : statusCode;
  }
}

export default LambdaAdapter;
