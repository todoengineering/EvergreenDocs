import { z } from "zod";
import { parameterStoreService } from "@evergreendocs/services";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      OPENAI_MODEL: string;
    }
  }
}

const configSchema = z.object({
  github: z.object({
    webhookSecret: z.string().min(1),
  }),
});

const githubAppAuth = await parameterStoreService.getSecretJson({
  stage: "production",
  parameter: "githubapp",
});

const config = configSchema.parse({
  github: {
    webhookSecret: githubAppAuth.webhookSecret,
  },
});

export default config;
