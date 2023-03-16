import { z } from "zod";

import { languageCodes } from "../../translation/iso639.js";

const TranslatePresetConfigSchema = z.object({
  preset: z.literal("translate"),
  type: z.optional(z.enum(["json", "md"])),
  inputPath: z.string().min(1),
  outputPath: z.string().min(1),
  language: z.enum(languageCodes),
});

export default TranslatePresetConfigSchema;
