import { Entity } from "electrodb";

import config from "../config.js";
import ddbClient from "../ddb-client.js";

const task = new Entity(
  {
    model: {
      entity: "task",
      version: "1",
      service: "workflowLoggingService",
    },
    attributes: {
      preset: {
        type: ["code-comment", "readme", "translate"] as const,
        required: true,
      },
      headCommit: {
        type: "string",
        required: true,
      },
      status: {
        type: ["skipped", "in_progress", "failed", "success", "cancelled"] as const,
        required: true,
      },
      startedAt: {
        type: "number",
        readOnly: true,
        default: () => Date.now(),
      },
      completedAt: {
        type: "number",
        watch: ["status"],
        set: (_, { status }) =>
          status === "success" || status === "failed" ? Date.now() : undefined,
      },
    },
    indexes: {
      task: {
        collection: "workflowTasks",
        pk: {
          field: "pk",
          composite: ["headCommit"],
        },
        sk: {
          field: "sk",
          composite: ["preset"],
        },
      },
    },
  },
  { table: config.tableName, client: ddbClient }
);

export default task;
