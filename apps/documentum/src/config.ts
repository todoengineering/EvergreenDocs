import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      OPENAI_MODEL: string;
    }
  }
}

const configSchema = z.object({
  openAi: z.object({
    key: z.string().min(1),
    model: z.union([
      z.literal("text-ada-001"),
      z.literal("text-babbage-001"),
      z.literal("text-curie-001"),
      z.literal("text-davinci-003"),
    ]),
  }),
});

const config = configSchema.parse({
  openAi: {
    key: process.env["OPENAI_API_KEY"],
    model: process.env["OPENAI_MODEL"],
  },
});

export default config;
