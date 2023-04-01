import * as dotenv from "dotenv";
dotenv.config();

import { SSTConfig } from "sst";

import authStack from "./packages/stacks/src/auth.js";
import apiStack from "./packages/stacks/src/api.js";
import githubWebhookIngestStack from "./packages/stacks/src/github-webhook-ingest.js";
import workflowProcessorStack from "./packages/stacks/src/workflow-processor.js";
import cacheStack from "./packages/stacks/src/cache.js";
import githubActionsPermissionsStack from "./packages/stacks/src/github-actions-permissions.js";
import route53Stack from "./packages/stacks/src/route53.js";
import websiteStack from "./packages/stacks/src/website.js";

const validStages = ["isaac-development", "dan-development", "production"];

export default {
  config() {
    return {
      name: "evergreendocs",
      region: "eu-west-1",
    };
  },
  async stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      logRetention: "one_day",
      environment: {
        SST_STAGE: app.stage,
      },
      nodejs: {
        format: "esm",
      },
    });

    if (!validStages.includes(app.stage)) {
      throw new Error(`Invalid stage: ${app.stage}, must be one of: ${validStages.join(", ")}`);
    }

    await app.stack(githubActionsPermissionsStack);
    await app.stack(route53Stack);
    await app.stack(cacheStack);
    await app.stack(githubWebhookIngestStack);
    await app.stack(authStack);
    await app.stack(workflowProcessorStack);
    await app.stack(apiStack);
    await app.stack(websiteStack);
  },
} satisfies SSTConfig;
