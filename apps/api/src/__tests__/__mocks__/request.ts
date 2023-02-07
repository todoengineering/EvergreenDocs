import type { FastifyRequest } from "fastify";
import { vi } from "vitest";

const fakeRequest: FastifyRequest = {
  id: "fake-request-id",
  ip: "fake-ip",
  ips: [],
  hostname: "fake-hostname",
  log: {
    level: "info",
    child: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fatal: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    silent: vi.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  },
  method: "GET",
  params: {},
  protocol: "http",
  query: {},
  headers: {},
  body: {},
  routeConfig: {},
  routeSchema: {},
  url: "fake-url",
  routerPath: "fake-router-path",
  routerMethod: "fake-router-method",
  is404: false,
  compileValidationSchema: vi.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeOptions: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValidationFunction: vi.fn() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateInput: vi.fn() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server: {} as any,
};

export default fakeRequest;
