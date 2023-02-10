import { StackContext, Function, EventBus, Stack } from "sst/constructs";
import { EventBus as CdkEventBus } from "aws-cdk-lib/aws-events";

import banner from "./banner.js";

async function apiStack({ stack }: StackContext) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let sunrise: Function | null = null;

  if (stack.stage === "production") {
    sunrise = new Function(stack, "sunrise", {
      handler: "../../apps/sunrise/src/index.handler",
      functionName: `sunrise-${stack.stage}`,
      timeout: "15 seconds",
    });
  }

  const documentum = new Function(stack, "documentum", {
    handler: "../../apps/documentum/src/index.handler",
    functionName: `documentum-${stack.stage}`,
    timeout: "5 minutes",
    nodejs: {
      banner,
    },
    environment: {
      OPENAI_API_KEY: process.env["OPENAI_API_KEY"] as string,
      OPENAI_MODEL: "text-ada-001",
    },
  });

  new EventBus(stack, "default-event-bus", {
    rules: {
      "github-webhook-ingest": {
        pattern: { source: ["github.com"], detailType: ["push"] },
        targets: { documentum },
      },
    },
    cdk: {
      eventBus: CdkEventBus.fromEventBusArn(
        stack,
        "default-event-bus-aws",
        `arn:aws:events:${stack.region}:${stack.account}:event-bus/default`
      ),
    },
  });

  if (sunrise?.url) {
    stack.addOutputs({
      sunriseFunctionUrl: sunrise.url,
    });
  }
}

export default apiStack;
