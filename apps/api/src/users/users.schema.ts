import { z } from "zod";

const User = z.object({
  id: z.string(),
  email: z.string(),
});

export { User };
