import { Service } from "electrodb";

import { workflow, task } from "./entities/index.js";
import type { Types } from "./types.js";

const workflowLoggingService = new Service({
  workflow,
  task,
});

export default workflowLoggingService;
export type { Types as WorkflowLoggingServiceTypes };
