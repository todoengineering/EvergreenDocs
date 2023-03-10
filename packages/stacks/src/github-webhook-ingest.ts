import { StackContext, Function } from "sst/constructs";
import { EventBus as CdkEventBus } from "aws-cdk-lib/aws-events";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

async function githubWebhookIngestStack({ stack }: StackContext) {
  const defaultEventBus = CdkEventBus.fromEventBusArn(
    stack,
    "default-event-bus-aws",
    `arn:aws:events:${stack.region}:${stack.account}:event-bus/default`
  );

  if (stack.stage === "production") {
    const githubWebhookIngestLambda = new Function(stack, "github-webhook-ingest", {
      handler: "apps/github-webhook-ingest/src/index.handler",
      functionName: `github-webhook-ingest-${stack.stage}`,
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

    if (githubWebhookIngestLambda?.url) {
      stack.addOutputs({
        githubWebhookIngestEndpoint: githubWebhookIngestLambda.url,
      });
    }
  }

  return {
    eventBus: defaultEventBus,
  };
}

export default githubWebhookIngestStack;
