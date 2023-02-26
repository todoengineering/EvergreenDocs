import { z } from "zod";

import PresetConfigSchema from "./presets/index.js";

const EvergreenConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  generates: z.array(PresetConfigSchema),
});

type EvergreenConfig = z.infer<typeof EvergreenConfigSchema>;
type PresetConfig = z.infer<typeof PresetConfigSchema>;

export default EvergreenConfigSchema;
export type { EvergreenConfig, PresetConfig };
