import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_EVERGREEN_API_URL: string;
      NEXT_PUBLIC_EVERGREEN_AUTH_URL: string;
    }
  }
}

// This allows us to lazy load the config, which is useful when building nextjs. Also caches the parsed config.
class Config {
  private readonly configSchema = z.object({
    nodeEnv: z.enum(["development", "production"]).default("production"),
    apiUrl: z.string().url(),
    authUrl: z.string().url(),
  });
  private readonly unknownConfig: unknown = {
    nodeEnv: process.env["NODE_ENV"],
    apiUrl: process.env["NEXT_PUBLIC_EVERGREEN_API_URL"],
    authUrl: process.env["NEXT_PUBLIC_EVERGREEN_AUTH_URL"],
  };

  private _config?: z.infer<typeof this.configSchema>;

  get get() {
    if (!this._config) {
      this._config = this.configSchema.parse(this.unknownConfig);
    }

    return this._config;
  }
}

export default new Config();
