import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CACHE_TABLE_NAME: string;
    }
  }
}

const configSchema = z.object({
  // TODO: Make this required
  cacheTableName: z.string().default(""),
});

const config = configSchema.parse({
  cacheTableName: process.env["CACHE_TABLE_NAME"],
});

export default config;
