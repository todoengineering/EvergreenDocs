import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      OPENAI_MODEL: string;
    }
  }
}

const client = new SecretsManagerClient({
  region: "eu-west-1",
});

const configSchema = z.object({
  openAi: z.object({
    key: z.string().min(1),
    model: z.union([
      z.literal("text-ada-001"),
      z.literal("text-babbage-001"),
      z.literal("text-curie-001"),
      z.literal("text-davinci-003"),
    ]),
  }),
  github: z.object({
    appId: z.string().min(1),
    privateKey: z.string().min(1),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
  }),
});

const githubAppSecretsValueResponse = await client.send(
  new GetSecretValueCommand({
    SecretId: "development/evergreendocs/githubapp",
  })
);

const githubAppPrivateKeySecretsValueResponse = await client.send(
  new GetSecretValueCommand({
    SecretId: "development/evergreendocs/githubapp/privatekey",
  })
);
const githubAppAuth = JSON.parse(githubAppSecretsValueResponse.SecretString || "{}");

const config = configSchema.parse({
  openAi: {
    key: process.env["OPENAI_API_KEY"],
    model: process.env["OPENAI_MODEL"],
  },
  github: {
    appId: githubAppAuth?.appId,
    clientId: githubAppAuth?.clientId,
    clientSecret: githubAppAuth?.clientSecret,
    privateKey: githubAppPrivateKeySecretsValueResponse.SecretString,
  },
});

export default config;
