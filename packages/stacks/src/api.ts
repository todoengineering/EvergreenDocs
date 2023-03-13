import { StackContext, Api, use, ApiProps } from "sst/constructs";

import authStack from "./auth.js";
import cacheStack from "./cache.js";
import workflowProcessorStack from "./workflow-processor.js";
import githubWebhookIngestStack from "./github-webhook-ingest.js";

async function apiStack({ stack }: StackContext) {
  const { cacheTable } = use(cacheStack);
  const { authApi } = use(authStack);
  const { workflowLogsTable } = use(workflowProcessorStack);
  const { githubWebhookIngestLambda } = use(githubWebhookIngestStack);

  const routes: ApiProps["routes"] = {
    "GET /trpc/{proxy+}": {
      function: {
        handler: "apps/api/main.handler",
        functionName: `api-${stack.stage}`,
        bind: [authApi],
        environment: {
          CACHE_TABLE_NAME: cacheTable.tableName,
          WORKFLOW_LOGS_TABLE_NAME: workflowLogsTable.tableName,
        },
      },
    },
  };

  if (githubWebhookIngestLambda) {
    routes["POST /github-webhook-ingest"] = {
      function: githubWebhookIngestLambda,
    };
  }

  const api = new Api(stack, "api", {
    routes,
    customDomain: {
      domainName: "api.ever-green.io",
      hostedZone: "ever-green.io",
    },
  });
  api.attachPermissions([workflowLogsTable, cacheTable]);

  stack.addOutputs({
    apiEndpoint: `${api.customDomainUrl}/trpc`,
  });

  if (githubWebhookIngestLambda) {
    stack.addOutputs({
      githubWebhookIngestEndpoint: `${api.customDomainUrl}/github-webhook-ingest`,
    });
  }
}

export default apiStack;
