import { Function, StackContext, use } from "sst/constructs";
import { Auth } from "sst/constructs/future";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

import cacheStack from "./cache";

async function authStack({ stack }: StackContext) {
  const { cacheTable } = use(cacheStack);

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
      domainName: "auth.ever-green.io",
      hostedZone: "ever-green.io",
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
