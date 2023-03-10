import { z } from "zod";

const TranslatePresetConfigSchema = z.object({
  preset: z.literal("translate"),
  inputPath: z.string().min(1),
  outputPath: z.string().min(1),
  language: z.string().min(2).max(2),
});

export default TranslatePresetConfigSchema;
