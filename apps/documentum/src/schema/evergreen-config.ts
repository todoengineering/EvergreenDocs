import { z } from "zod";

const ReadmePresetConfigSchema = z.object({
  preset: z.literal("readme"),
  path: z.string().min(1),
  sections: z.array(z.object({ name: z.string().min(1) })).optional(),
});

const CodeCommentPresetConfigSchema = z.object({
  preset: z.literal("code-comment"),
  path: z.string().min(1),
  type: z.string().min(1),
  name: z.string().min(1),
});

const PresetConfigSchema = z.union([ReadmePresetConfigSchema, CodeCommentPresetConfigSchema]);

const EvergreenConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  generates: z.array(PresetConfigSchema),
});

type EvergreenConfig = z.infer<typeof EvergreenConfigSchema>;
type PresetConfig = z.infer<typeof PresetConfigSchema>;
type ReadmePresetConfig = z.infer<typeof ReadmePresetConfigSchema>;
type CodeCommentPresetConfig = z.infer<typeof CodeCommentPresetConfigSchema>;

export default EvergreenConfigSchema;
export type { EvergreenConfig, PresetConfig, ReadmePresetConfig, CodeCommentPresetConfig };
