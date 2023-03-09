import { z } from "zod";
import { secretsManagerService } from "@evergreendocs/services";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      OPENAI_MODEL: string;
    }
  }
}

type GitHubAppAuth = {
  appId: string;
  clientId: string;
  clientSecret: string;
};

const githubAppAuth = await secretsManagerService.getSecretJson<GitHubAppAuth>(
  "development/evergreendocs/githubapp"
);

const githubAppPrivateKey = await secretsManagerService.getSecret(
  "development/evergreendocs/githubapp/privatekey"
);

const configSchema = z.object({
  openAi: z.object({
    key: z.string().min(1),
    model: z.union([
      z.literal("text-ada-001"),
      z.literal("text-babbage-001"),
      z.literal("text-curie-001"),
      z.literal("text-davinci-003"),
      z.literal("code-davinci-002"),
    ]),
  }),
  github: z.object({
    appId: z.string().min(1),
    privateKey: z.string().min(1),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
  }),
});

const config = configSchema.parse({
  openAi: {
    key: process.env["OPENAI_API_KEY"],
    model: process.env["OPENAI_MODEL"],
  },
  github: {
    appId: githubAppAuth?.appId,
    clientId: githubAppAuth?.clientId,
    clientSecret: githubAppAuth?.clientSecret,
    privateKey: githubAppPrivateKey,
  },
});

export default config;
