import { StackContext, NextjsSite, use } from "sst/constructs";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import * as cdk from "aws-cdk-lib";

import apiStack from "./api.js";
import authStack from "./auth.js";

async function websiteStack({ stack }: StackContext) {
  const { authApi } = use(authStack);
  const { apiEndpoint } = use(apiStack);

  const site = new NextjsSite(stack, "Site", {
    path: "apps/web",
    customDomain: {
      domainName: "ever-green.io",
      domainAlias: "www.ever-green.io",
      // hostedZone: "ever-green.io",
      // TODO: Use the hosted zone above instead of the one below. Above one was referencing the wrong hosted zone for some reason.
      cdk: {
        hostedZone: HostedZone.fromHostedZoneAttributes(stack, "HostedZone", {
          hostedZoneId: "Z08384492DASBHIMLZ9HN",
          zoneName: "ever-green.io",
        }),
      },
    },
    environment: {
      NEXT_PUBLIC_EVERGREEN_API_URL: apiEndpoint,
      NEXT_PUBLIC_EVERGREEN_AUTH_URL: authApi.url,
    },
  });

  stack.getAllFunctions().forEach((fn) => {
    // We assume that the API is in us-east-1, it's an edge lambda and can't be traced
    if (!fn.functionArn.includes("us-east-1")) {
      cdk.Tags.of(fn).add("lumigo:auto-trace", "true");
    }
  });

  stack.addOutputs({
    webAppUrl: site.url || "http://localhost:3000",
  });
}

export default websiteStack;
