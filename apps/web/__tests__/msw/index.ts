import { setupServer } from "msw/node";

import s3Handlers from "./s3.js";

const handlers = [...s3Handlers];

const server = setupServer(...handlers);

export default server;
