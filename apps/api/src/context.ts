import * as trpc from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import clerk from "@clerk/clerk-sdk-node";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsManagerClient = new SecretsManagerClient({
  region: "eu-west-1",
});

const clerkSecretsResponse = await secretsManagerClient.send(
  new GetSecretValueCommand({
    SecretId: "development/evergreendocs/clerk",
  })
);

const clerkSecrets = JSON.parse(clerkSecretsResponse.SecretString || "{}");

const createContext = async ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  const authHeader = event.headers["authorization"];

  if (!authHeader) {
    return {};
  }

  const splitPem = clerkSecrets.jwtVerificationKey.match(/.{1,64}/g);
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" + splitPem?.join("\n") + "\n-----END PUBLIC KEY-----";

  try {
    const decoded = jwt.verify(authHeader, publicKey);
    if (typeof decoded !== "object") {
      return {};
    }

    if (!decoded.sub || !decoded.sid) {
      return {};
    }

    const user = await clerk.users.getUser(decoded.sub);
    const session = await clerk.sessions.getSession(decoded.sid);

    return { user, session };
  } catch (error) {
    console.error(error);
    return {};
  }
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export default createContext;
export type { Context };
