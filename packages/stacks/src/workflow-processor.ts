import { StackContext, Function, EventBus, Table, use } from "sst/constructs";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

import banner from "./banner.js";
import githubWebhookIngestStack from "./github-webhook-ingest.js";

async function workflowProcessorStack({ stack }: StackContext) {
  const { eventBus } = use(githubWebhookIngestStack);

  const workflowLogsTable = new Table(stack, "workflow-logs", {
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    globalIndexes: {
      "gsi1pk-gsi1sk-index": {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
        projection: "all",
      },
    },
  });

  const workflowProcessorLambda = new Function(stack, "workflow-processor", {
    handler: "apps/workflow-processor/src/index.handler",
    functionName: `workflow-processor`,
    timeout: "5 minutes",
    nodejs: {
      banner,
    },
    environment: {
      OPENAI_API_KEY: process.env["OPENAI_API_KEY"] as string,
      OPENAI_MODEL: "text-davinci-003",
      WORKFLOW_LOGS_TABLE_NAME: workflowLogsTable.tableName,
    },
    initialPolicy: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          `arn:aws:secretsmanager:${stack.region}:${stack.account}:secret:development/evergreendocs/githubapp*`,
        ],
      }),
    ],
    url: true,
  });
  workflowProcessorLambda.attachPermissions([workflowLogsTable]);

  // Attach a rule to the event bus provided from the github-webhook-ingest stack
  new EventBus(stack, "default-event-bus", {
    rules: {
      "github-webhook-ingest": {
        pattern: {
          source: ["github.com"],
          detailType: ["push"],
          detail: { ref: ["refs/heads/main"] },
        },
        targets: { workflowProcessor: workflowProcessorLambda },
      },
    },
    cdk: {
      eventBus,
    },
  });

  return {
    workflowLogsTable,
  };
}

export default workflowProcessorStack;
