import { Function, StackContext, use } from "sst/constructs";
import { Auth } from "sst/constructs/future";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { HostedZone } from "aws-cdk-lib/aws-route53";

import cacheStack from "./cache";
import { getStackSubdomain } from "./domain.js";
import route53Stack from "./route53";

async function authStack({ stack }: StackContext) {
  const { cacheTable } = use(cacheStack);
  // Needed for the custom domain
  use(route53Stack);

  const authLambda = new Function(stack, "auth-lambda", {
    handler: "apps/auth/src/index.handler",
    functionName: `auth-${stack.stage}`,
    environment: {
      CACHE_TABLE_NAME: cacheTable.tableName,
    },
    initialPolicy: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          `arn:aws:secretsmanager:${stack.region}:${stack.account}:secret:development/evergreendocs/githubapp*`,
        ],
      }),
    ],
  });

  authLambda.attachPermissions([cacheTable]);

  const auth = new Auth(stack, "auth", {
    authenticator: authLambda,
    customDomain: {
      domainName: `${getStackSubdomain(stack, "auth")}.ever-green.io`,
      // hostedZone: "ever-green.io",
      // TODO: Use the hosted zone above instead of the one below. Above one was referencing the wrong hosted zone for some reason.
      cdk: {
        hostedZone: HostedZone.fromHostedZoneAttributes(stack, "HostedZone", {
          hostedZoneId: "Z08384492DASBHIMLZ9HN",
          zoneName: "ever-green.io",
        }),
      },
    },
  });

  stack.addOutputs({
    authEndpoint: auth.url,
  });

  return {
    authApi: auth,
  };
}

export default authStack;
