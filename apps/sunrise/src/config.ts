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
  github: z.object({
    webhookSecret: z.string().min(1),
  }),
});

const githubAppSecretsValueResponse = await client.send(
  new GetSecretValueCommand({
    SecretId: "development/evergreendocs/githubapp",
  })
);

const githubAppAuth = JSON.parse(githubAppSecretsValueResponse.SecretString || "{}");

const config = configSchema.parse({
  github: {
    webhookSecret: githubAppAuth?.webhookSecret,
  },
});

export default config;
