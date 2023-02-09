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
  region: "us-east-1",
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
    appId: z.number().min(1),
    privateKey: z.string().min(1),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
  }),
});

const secretValueCommandResponse = await client.send(
  new GetSecretValueCommand({
    SecretId: "development/evergreendocs/githubapp",
  })
);
const githubAppAuth = JSON.parse(secretValueCommandResponse.SecretString || "{}");

const config = configSchema.parse({
  openAi: {
    key: process.env["OPENAI_API_KEY"],
    model: process.env["OPENAI_MODEL"],
  },
  github: {
    appId: githubAppAuth?.appId,
    privateKey: githubAppAuth?.privateKey,
    clientId: githubAppAuth?.clientId,
    clientSecret: githubAppAuth?.clientSecret,
  },
});

export default config;
