import * as dotenv from "dotenv";
dotenv.config();

import { SSTConfig } from "sst";

import apiStack from "./packages/stacks/src/api.js";
import frontendStack from "./packages/stacks/src/frontend.js";

const validStages = ["isaac-development", "dan-development", "production"];

export default {
  config() {
    return {
      name: "evergreendocs",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      logRetention: "one_day",
      nodejs: {
        format: "esm",
      },
    });

    if (!validStages.includes(app.stage)) {
      throw new Error(`Invalid stage: ${app.stage}, must be one of: ${validStages.join(", ")}`);
    }

    app.stack(apiStack);
    app.stack(frontendStack);
  },
} satisfies SSTConfig;
