import { StackContext, Function } from "sst/constructs";

function apiStack({ stack }: StackContext) {
  const documentum = new Function(stack, "documentum", {
    handler: "../../apps/documentum/src/index.handler",
    functionName: `documentum-${stack.stage}`,
    logRetention: "one_day",
    timeout: "5 minutes",
    runtime: "nodejs18.x",
    nodejs: {
      format: "esm",
      banner: [
        // WORKAROUND: Add `crypto` and `CryptoKey` for next-auth middleware - https://github.com/serverless-stack/open-next#workaround-nextauth-middleware
        "import crypto from 'node:crypto';",
        "Object.assign(globalThis, {",
        "  crypto,",
        "  self: {},",
        "});",
      ].join(""),
    },
    environment: {
      OPENAI_API_KEY: process.env["OPENAI_API_KEY"] as string,
      OPENAI_MODEL: "text-ada-001",
    },
    url: true,
  });

  stack.addOutputs({
    ApiEndpoint: documentum.url!,
  });
}

export default apiStack;
