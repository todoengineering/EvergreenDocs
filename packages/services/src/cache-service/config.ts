import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CACHE_TABLE_NAME: string;
    }
  }
}

const configSchema = z.object({
  cacheTableName: z.string(),
});

const config = configSchema.parse({
  cacheTableName: process.env["CACHE_TABLE_NAME"],
});

export default config;
