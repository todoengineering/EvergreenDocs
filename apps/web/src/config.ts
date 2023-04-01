import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_EVERGREEN_API_URL: string;
      NEXT_PUBLIC_EVERGREEN_AUTH_URL: string;
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
  nodeEnv: z.enum(["development", "production"]).default("production"),
  apiUrl: z.string().url(),
  authUrl: z.string().url(),
});

const config = configSchema.parse({
  stage: process.env["SST_STAGE"],
  nodeEnv: process.env["NODE_ENV"],
  apiUrl: process.env["NEXT_PUBLIC_EVERGREEN_API_URL"],
  authUrl: process.env["NEXT_PUBLIC_EVERGREEN_AUTH_URL"],
});

export default config;
