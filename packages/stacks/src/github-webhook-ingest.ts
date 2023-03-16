import { StackContext, Function } from "sst/constructs";
import { EventBus as CdkEventBus } from "aws-cdk-lib/aws-events";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";

async function githubWebhookIngestStack({ stack }: StackContext) {
  const defaultEventBus = CdkEventBus.fromEventBusArn(
    stack,
    "default-event-bus-aws",
    `arn:aws:events:${stack.region}:${stack.account}:event-bus/default`
  );

  // eslint-disable-next-line @typescript-eslint/ban-types
  let githubWebhookIngestLambda: Function | null = null;

  if (stack.stage === "production") {
    githubWebhookIngestLambda = new Function(stack, "github-webhook-ingest", {
      handler: "apps/github-webhook-ingest/src/index.handler",
      functionName: `github-webhook-ingest-${stack.stage}`,
      timeout: "15 seconds",
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

    if (githubWebhookIngestLambda?.url) {
      stack.addOutputs({
        githubWebhookIngestEndpoint: githubWebhookIngestLambda.url,
      });
    }
  }

  stack.getAllFunctions().forEach((fn) => {
    // We assume that the API is in us-east-1, it's an edge lambda and can't be traced
    const autoTrace = stack.stage === "production" && !fn.functionArn.includes("us-east-1");

    cdk.Tags.of(fn).add("lumigo:auto-trace", String(autoTrace));
  });

  return {
    eventBus: defaultEventBus,
    githubWebhookIngestLambda,
  };
}

export default githubWebhookIngestStack;
