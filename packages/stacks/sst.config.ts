import { SSTConfig } from "sst";

import authenticationStack from "./src/authentication.js";
import imageStack from "./src/image.js";

export default {
  config() {
    return {
      name: "openreadme",
      region: "eu-west-1",
      profile: "personal",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      nodejs: {
        format: "esm",
      },
    });

    app.stack(authenticationStack).stack(imageStack);

    // TODO: Add RDS and Lambdas for Next.js and tRPC
  },
} satisfies SSTConfig;
