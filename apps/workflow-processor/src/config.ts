import { z } from "zod";
import { parameterStoreService } from "@evergreendocs/services";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      OPENAI_MODEL: string;
      SST_STAGE: "isaac-development" | "dan-development" | "production";
    }
  }
}

const githubAppAuth = await parameterStoreService.getSecretJson({
  stage: "production",
  parameter: "githubapp",
});

const { key: openAiKey } = await parameterStoreService.getSecretJson({
  stage: "production",
  parameter: "openai",
});

const configSchema = z.object({
  stage: z.union([
    z.literal("isaac-development"),
    z.literal("dan-development"),
    z.literal("production"),
  ]),
  openAi: z.object({
    key: z.string().min(1),
    model: z.literal("gpt-3.5-turbo-0301"),
  }),
  github: z.object({
    appId: z.string().min(1),
    privateKey: z.string().min(1),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
  }),
});

const config = configSchema.parse({
  stage: process.env["SST_STAGE"],
  openAi: {
    key: openAiKey,
    model: process.env["OPENAI_MODEL"],
  },
  github: {
    appId: githubAppAuth.appId,
    clientId: githubAppAuth.clientId,
    clientSecret: githubAppAuth.clientSecret,
    privateKey: githubAppAuth.privatekey,
  },
});

export default config;
