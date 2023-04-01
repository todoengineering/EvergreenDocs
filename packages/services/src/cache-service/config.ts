import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CACHE_TABLE_NAME: string;
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
  // TODO: Make this required
  cacheTableName: z.string().default(""),
});

const config = configSchema.parse({
  stage: process.env["SST_STAGE"],
  cacheTableName: process.env["CACHE_TABLE_NAME"],
});

export default config;
