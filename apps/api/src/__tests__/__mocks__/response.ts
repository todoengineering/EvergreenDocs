// TODO: fix when thi is merged: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/63892
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mock } from "node:test";

import type { FastifyReply } from "fastify";

const fakeResponse: FastifyReply = {
  code: mock.fn(),
  header: mock.fn(),
  send: mock.fn(),
  serializer: mock.fn(),
  type: mock.fn(),
  getHeader: mock.fn(),
  hasHeader: mock.fn(),
  removeHeader: mock.fn(),
  callNotFound: mock.fn(),
  statusCode: 200,
  sent: false,
  status: mock.fn(),
  headers: mock.fn(),
  getHeaders: mock.fn(),
  hijack: mock.fn(),
  getResponseTime: mock.fn(),
  serialize: mock.fn(),
  compileSerializationSchema: mock.fn(),
  then: mock.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redirect: mock.fn() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSerializationFunction: mock.fn() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serializeInput: mock.fn() as any,
};

export default fakeResponse;
