import { z } from "zod";

import { User } from "./users/users.schema.js";

module Types {
  export type User = z.infer<typeof User>;
}

export type { Types };
