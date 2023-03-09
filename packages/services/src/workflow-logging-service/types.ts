import { EntityItem } from "electrodb";

import { task, workflow } from "./entities/index.js";

module Types {
  export type Task = EntityItem<typeof task>;
  export type Workflow = EntityItem<typeof workflow>;
}

export type { Types };
