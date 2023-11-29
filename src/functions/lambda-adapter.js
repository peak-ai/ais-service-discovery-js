'use strict';

class LambdaAdapter {
  constructor(client) {
    this.client = client;
  }

  async call(name, body, opts) {
    const params = {
      ...opts,
      FunctionName: name,
      Payload: JSON.stringify(body),
    };
    const { Payload, StatusCode } = await this.client.invoke(params);

    // Check if the payload exists and if the status code indicates success
    if (Payload && StatusCode === 200) {
     
        // Decode Uint8Array to string using 'utf-8' encoding
        const decoder = new TextDecoder('utf-8');
        const decodedPayload = decoder.decode(Payload);

        // Attempt to parse the decoded payload as JSON
        return JSON.parse(decodedPayload);
     
    } else {
      // Handle different or error status codes as needed
      return StatusCode;
    }
  }
}

module.exports = LambdaAdapter;
