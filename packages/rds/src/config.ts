import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
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
});

const config = configSchema.parse({
  stage: process.env["SST_STAGE"],
});

export default config;
