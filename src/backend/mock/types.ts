export type Resolver = {
  type?: string;
  endpoint?: string;
  mockedResponse?: string;
};

export type Service = {
  type: string;
  resolve: Resolver;
};

export type Config = {
  [key: string]: Service;
};
