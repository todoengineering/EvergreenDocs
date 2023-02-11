// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { mock } from "node:test";
import type { FastifyRequest } from "fastify";

const fakeRequest: FastifyRequest = {
  id: "fake-request-id",
  ip: "fake-ip",
  ips: [],
  hostname: "fake-hostname",
  log: {
    level: "info",
    child: mock.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: mock.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fatal: mock.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: mock.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace: mock.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: mock.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: mock.fn() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    silent: mock.fn() as any,
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
  compileValidationSchema: mock.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeOptions: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValidationFunction: mock.fn() as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateInput: mock.fn() as any,
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
