import { SSTConfig } from "sst";

import apiStack from "./src/api.js";

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
      nodejs: {
        format: "esm",
      },
    });

    app.stack(apiStack);
  },
} satisfies SSTConfig;
