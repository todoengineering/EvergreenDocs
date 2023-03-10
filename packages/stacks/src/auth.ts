import { Function, StackContext, use } from "sst/constructs";
import { Auth } from "sst/constructs/future";

import cacheStack from "./cache";

async function authStack({ stack }: StackContext) {
  const { cacheTable } = use(cacheStack);

  const authLambda = new Function(stack, "auth-lambda", {
    handler: "apps/auth/src/index.handler",
    functionName: `auth`,
  });

  authLambda.attachPermissions([cacheTable]);

  const auth = new Auth(stack, "auth", {
    authenticator: authLambda,
  });

  stack.addOutputs({
    authEndpoint: auth.url,
  });

  return {
    authApi: auth,
  };
}

export default authStack;
