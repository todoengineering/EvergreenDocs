import { StackContext, Api, use } from "sst/constructs";

import authStack from "./auth.js";
import cacheStack from "./cache.js";
import workflowProcessorStack from "./workflow-processor.js";

async function apiStack({ stack }: StackContext) {
  const { cacheTable } = use(cacheStack);
  const { authApi } = use(authStack);
  const { workflowLogsTable } = use(workflowProcessorStack);

  const apiLambda = new Api(stack, "api", {
    routes: {
      "GET /{proxy+}": {
        function: {
          handler: "apps/api/main.handler",
          functionName: `api`,
          bind: [authApi],
        },
      },
    },
  });
  apiLambda.attachPermissions([workflowLogsTable, cacheTable]);

  stack.addOutputs({
    apiEndpoint: apiLambda.url as string,
  });
}

export default apiStack;
