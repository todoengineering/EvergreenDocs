import { z } from "zod";

const CodeCommentPresetConfigSchema = z.object({
  preset: z.literal("code-comment"),
  path: z.string().min(1),
  type: z.string().min(1),
  name: z.string().min(1),
});

export default CodeCommentPresetConfigSchema;
