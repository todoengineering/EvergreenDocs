import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_EVERGREEN_API_URL: string;
      NEXT_PUBLIC_EVERGREEN_AUTH_URL: string;
    }
  }
}

const configSchema = z.object({
  nodeEnv: z.enum(["development", "production"]).default("production"),
  apiUrl: z.string().url(),
  authUrl: z.string().url(),
});

const config = configSchema.parse({
  nodeEnv: process.env["NODE_ENV"],
  apiUrl: process.env["NEXT_PUBLIC_EVERGREEN_API_URL"],
  authUrl: process.env["NEXT_PUBLIC_EVERGREEN_AUTH_URL"],
});

export default config;
