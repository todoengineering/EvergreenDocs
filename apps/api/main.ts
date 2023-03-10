import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { ApiHandler } from "sst/node/api";

import createContext from "./src/context/index.js";
import appRouter from "./src/router.js";

const handler = ApiHandler(
  awsLambdaRequestHandler({
    router: appRouter,
    createContext,
  })
);

export { handler };
