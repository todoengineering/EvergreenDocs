import { EntityItem } from "electrodb";

import { session } from "./entities/index.js";

module Types {
  export type Session = EntityItem<typeof session>;
}

export type { Types };
