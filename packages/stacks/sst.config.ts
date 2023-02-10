import { SSTConfig } from "sst";

import apiStack from "./src/api.js";

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
  },
} satisfies SSTConfig;
