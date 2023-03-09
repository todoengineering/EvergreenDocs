import { StackContext, Function, EventBus, Table } from "sst/constructs";
import { EventBus as CdkEventBus } from "aws-cdk-lib/aws-events";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

import banner from "./banner.js";

async function apiStack({ stack }: StackContext) {
  const defaultEventBus = CdkEventBus.fromEventBusArn(
    stack,
    "default-event-bus-aws",
    `arn:aws:events:${stack.region}:${stack.account}:event-bus/default`
  );

  // eslint-disable-next-line @typescript-eslint/ban-types
  let sunrise: Function | null = null;

  if (stack.stage === "production") {
    sunrise = new Function(stack, "sunrise", {
      handler: "apps/sunrise/src/index.handler",
      functionName: `sunrise-${stack.stage}`,
      timeout: "15 seconds",
      url: true,
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["secretsmanager:GetSecretValue"],
          resources: [
            `arn:aws:secretsmanager:${stack.region}:${stack.account}:secret:development/evergreendocs/githubapp*`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["events:PutEvents"],
          resources: [defaultEventBus.eventBusArn],
        }),
      ],
    });
  }

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

  const api = new Function(stack, "api", {
    handler: "apps/api/main.handler",
    functionName: `api-${stack.stage}`,
    timeout: "30 seconds",
    url: {
      cors: {
        allowCredentials: true,
        allowHeaders: ["*"],
        allowMethods: ["*"],
        allowOrigins: ["http://localhost:3000"],
      },
    },
  });

  api.attachPermissions([workflowLogsTable]);

  const documentum = new Function(stack, "documentum", {
    handler: "apps/documentum/src/index.handler",
    functionName: `documentum-${stack.stage}`,
    timeout: "5 minutes",
    nodejs: {
      banner,
    },
    environment: {
      OPENAI_API_KEY: process.env["OPENAI_API_KEY"] as string,
      OPENAI_MODEL: "text-davinci-003",
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
  });

  new EventBus(stack, "default-event-bus", {
    rules: {
      "github-webhook-ingest": {
        pattern: {
          source: ["github.com"],
          detailType: ["push"],
          detail: { ref: ["refs/heads/main"] },
        },
        targets: { documentum },
      },
    },
    cdk: {
      eventBus: defaultEventBus,
    },
  });

  if (api.url) {
    stack.addOutputs({
      apiFunctionUrl: api.url,
    });
  }

  if (sunrise?.url) {
    stack.addOutputs({
      sunriseFunctionUrl: sunrise.url,
    });
  }
}

export default apiStack;
