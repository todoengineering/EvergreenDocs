import type { FastifyReply } from "fastify";
import { vi } from "vitest";

const fakeResponse: FastifyReply = {
  code: vi.fn(),
  header: vi.fn(),
  send: vi.fn(),
  serializer: vi.fn(),
  type: vi.fn(),
  getHeader: vi.fn(),
  hasHeader: vi.fn(),
  removeHeader: vi.fn(),
  callNotFound: vi.fn(),
  statusCode: 200,
  sent: false,
  status: vi.fn(),
  headers: vi.fn(),
  getHeaders: vi.fn(),
  hijack: vi.fn(),
  getResponseTime: vi.fn(),
  serialize: vi.fn(),
  compileSerializationSchema: vi.fn(),
  then: vi.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redirect: vi.fn() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSerializationFunction: vi.fn() as any,
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
  serializeInput: vi.fn() as any,
};

export default fakeResponse;
