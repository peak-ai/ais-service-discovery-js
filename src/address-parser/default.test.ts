import DefaultAddressParser from "./default";

describe("(DefaultAddressParser)", () => {
  it('should parse addresses', () => {
    const addr = "namespace.service->instance";
    const parser = new DefaultAddressParser();
    const result = parser.parse(addr);
    expect(result.namespace).toBe('namespace');
    expect(result.service).toBe('service');
    expect(result.instance).toBe('instance');
  });
});
