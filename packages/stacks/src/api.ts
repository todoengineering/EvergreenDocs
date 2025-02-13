import { StackContext, Api, use, ApiProps } from "sst/constructs";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";

import authStack from "./auth.js";
import cacheStack from "./cache.js";
import githubWebhookIngestStack from "./github-webhook-ingest.js";
import { getStackSubdomain } from "./domain.js";
import route53Stack from "./route53.js";

async function apiStack({ stack }: StackContext) {
  const { cacheTable } = use(cacheStack);
  const { authApi } = use(authStack);
  const { githubWebhookIngestLambda } = use(githubWebhookIngestStack);
  // Needed for the custom domain
  use(route53Stack);

  const routes: ApiProps["routes"] = {
    "GET /trpc/{proxy+}": {
      function: {
        handler: "apps/api/main.handler",
        functionName: `api-${stack.stage}`,
        bind: [authApi],
        initialPolicy: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["ssm:GetParameters"],
            resources: [
              `arn:aws:ssm:${stack.region}:${stack.account}:parameter/production/evergreendocs/githubapp/*`,
              `arn:aws:ssm:${stack.region}:${stack.account}:parameter/${stack.stage}/evergreendocs/rds/*`,
            ],
          }),
        ],
        environment: {
          CACHE_TABLE_NAME: cacheTable.tableName,
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
      domainName: `${getStackSubdomain(stack, "api")}.ever-green.io`,
      // hostedZone: "ever-green.io",
      // TODO: Use the hosted zone above instead of the one below. Above one was referencing the wrong hosted zone for some reason.
      cdk: {
        hostedZone: HostedZone.fromHostedZoneAttributes(stack, "HostedZone", {
          hostedZoneId: "Z08384492DASBHIMLZ9HN",
          zoneName: "ever-green.io",
        }),
      },
    },
  });
  api.attachPermissions([cacheTable]);

  const apiEndpoint = `${api.customDomainUrl}/trpc`;

  stack.addOutputs({
    apiEndpoint,
  });

  if (githubWebhookIngestLambda) {
    stack.addOutputs({
      githubWebhookIngestEndpoint: `${api.customDomainUrl}/github-webhook-ingest`,
    });
  }

  stack.getAllFunctions().forEach((fn) => {
    // We assume that the API is in us-east-1, it's an edge lambda and can't be traced
    const autoTrace = stack.stage === "production" && !fn.functionArn.includes("us-east-1");

    cdk.Tags.of(fn).add("lumigo:auto-trace", String(autoTrace));
  });

  return {
    apiEndpoint,
  };
}

export default apiStack;
