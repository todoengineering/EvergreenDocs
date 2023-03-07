import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import createContext from "./src/context.js";
import appRouter from "./src/router.js";

const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export { handler };
