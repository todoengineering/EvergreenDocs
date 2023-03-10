import { z } from "zod";

const ReadmePresetConfigSchema = z.object({
  preset: z.literal("readme"),
  path: z.string().min(1),
  sections: z.array(z.object({ name: z.string().min(1) })).optional(),
});

export default ReadmePresetConfigSchema;
