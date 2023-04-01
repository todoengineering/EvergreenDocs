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

const configSchema = z.object({
  stage: z.union([
    z.literal("isaac-development"),
    z.literal("dan-development"),
    z.literal("production"),
  ]),
  github: z.object({
    webhookSecret: z.string().min(1),
  }),
});

const githubAppAuth = await parameterStoreService.getSecretJson({
  stage: "production",
  parameter: "githubapp",
});

const config = configSchema.parse({
  stage: process.env["SST_STAGE"],
  github: {
    webhookSecret: githubAppAuth.webhookSecret,
  },
});

export default config;
