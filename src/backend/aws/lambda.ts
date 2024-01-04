import { Lambda } from '@aws-sdk/client-lambda';
import {
  Opts,
  Request,
  Response,
  ServiceResponse,
  IFunctionAdapter,
} from '../../types';

class LambdaAdapter implements IFunctionAdapter {
  private client: Lambda;

  constructor(client: Lambda) {
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

    const { Payload: payload, StatusCode: statusCode } =
      await this.client.invoke(params);
    return payload ? JSON.parse(payload.toString()) : statusCode;
  }
}

export default LambdaAdapter;
