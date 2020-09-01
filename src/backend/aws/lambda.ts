class LambdaAdapter {
  private client = '';

  constructor(client) {
    this.client = client;
  }

  async request(name, body, opts) {
    const params = {
      ...opts,
      FunctionName: name,
      Payload: JSON.stringify(body),
    };
    const { Payload, StatusCode } = await this.client.invoke(params).promise();
    return Payload ? JSON.parse(Payload) : StatusCode;
  }
}

export default LambdaAdapter;
