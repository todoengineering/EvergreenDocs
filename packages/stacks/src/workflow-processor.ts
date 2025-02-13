import { StackContext, Function, EventBus, use } from "sst/constructs";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";

import banner from "./banner.js";
import githubWebhookIngestStack from "./github-webhook-ingest.js";

async function workflowProcessorStack({ stack }: StackContext) {
  const { eventBus } = use(githubWebhookIngestStack);

  const workflowProcessorLambda = new Function(stack, "workflow-processor", {
    handler: "apps/workflow-processor/src/index.handler",
    functionName: `workflow-processor-${stack.stage}`,
    timeout: "5 minutes",
    nodejs: {
      banner,
    },
    environment: {
      OPENAI_API_KEY: process.env["OPENAI_API_KEY"] as string,
      OPENAI_MODEL: "gpt-3.5-turbo-0301",
    },
    initialPolicy: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ssm:GetParameters"],
        resources: [
          `arn:aws:ssm:${stack.region}:${stack.account}:parameter/production/evergreendocs/githubapp/*`,
          `arn:aws:ssm:${stack.region}:${stack.account}:parameter/production/evergreendocs/openai/*`,
          `arn:aws:ssm:${stack.region}:${stack.account}:parameter/${stack.stage}/evergreendocs/rds/*`,
        ],
      }),
    ],
    url: true,
  });

  const branches = new Set(["main", "master"]);

  if (typeof process.env["CURRENT_GIT_BRANCH"] === "string") {
    branches.add(process.env["CURRENT_GIT_BRANCH"]);
  }
  // Attach a rule to the event bus provided from the github-webhook-ingest stack  new EventBus(stack, "default-event-bus", {
  new EventBus(stack, "default-event-bus", {
    rules: {
      "github-webhook-ingest": {
        pattern: {
          source: ["github.com"],
          detailType: ["push"],
          detail: { ref: Array.from(branches).map((branch) => `refs/heads/${branch}`) },
        },
        targets: { workflowProcessor: workflowProcessorLambda },
      },
    },
    cdk: {
      eventBus,
    },
  });

  stack.getAllFunctions().forEach((fn) => {
    // We assume that the API is in us-east-1, it's an edge lambda and can't be traced
    const autoTrace = stack.stage === "production" && !fn.functionArn.includes("us-east-1");

    cdk.Tags.of(fn).add("lumigo:auto-trace", String(autoTrace));
  });
}

export default workflowProcessorStack;
