import { z } from "zod";

import CodeCommentPresetConfigSchema from "./code-comment.js";
import ReadmePresetConfigSchema from "./readme.js";
import TranslatePresetConfigSchema from "./translate.js";

const PresetConfigSchema = z.union([
  ReadmePresetConfigSchema,
  CodeCommentPresetConfigSchema,
  TranslatePresetConfigSchema,
]);

type ReadmePresetConfig = z.infer<typeof ReadmePresetConfigSchema>;
type CodeCommentPresetConfig = z.infer<typeof CodeCommentPresetConfigSchema>;
type TranslatePresetConfig = z.infer<typeof TranslatePresetConfigSchema>;

export default PresetConfigSchema;
export type { ReadmePresetConfig, CodeCommentPresetConfig, TranslatePresetConfig };
