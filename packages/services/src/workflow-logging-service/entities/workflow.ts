import { Entity } from "electrodb";

import config from "../config.js";
import ddbClient from "../ddb-client.js";

const workflow = new Entity(
  {
    model: {
      entity: "workflow",
      version: "1",
      service: "workflowLoggingService",
    },
    attributes: {
      headCommit: {
        type: "string",
        required: true,
      },
      repositoryFullName: {
        type: "string",
      },
      status: {
        type: ["skipped", "in_progress", "failed", "success", "cancelled"] as const,
        required: true,
      },
      startedAt: {
        type: "string",
        readOnly: true,
        required: true,
        default: () => new Date().toISOString(),
      },
      completedAt: {
        type: "string",
        watch: ["status"],
        set: (_, { status }) =>
          status === "success" || status === "failed" ? new Date().toISOString() : undefined,
      },
    },
    indexes: {
      workflow: {
        collection: "workflowTasks",
        pk: {
          field: "pk",
          composite: ["headCommit"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byRepositoryName: {
        index: "gsi1pk-gsi1sk-index",
        pk: {
          field: "gsi1pk",
          composite: ["repositoryFullName"],
        },
        sk: {
          field: "gsi1sk",
          composite: [],
        },
      },
    },
  },
  { table: config.tableName, client: ddbClient }
);

export default workflow;
