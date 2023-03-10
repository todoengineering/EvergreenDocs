import { Service } from "electrodb";

import { session } from "./entities/index.js";
import type { Types } from "./types.js";

const cacheService = new Service({
  session,
});

export default cacheService;
export type { Types as CacheServiceTypes };
