import { Entity } from "electrodb";

const workflow = new Entity({
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
    headCommitMessage: {
      type: "string",
      required: true,
    },
    status: {
      type: ["skipped", "in_progress", "failed", "success", "cancelled"] as const,
      required: true,
    },
    reason: {
      type: "string",
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
        status === "success" ||
        status === "failed" ||
        status === "skipped" ||
        status === "cancelled"
          ? new Date().toISOString()
          : undefined,
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
    workflowByRepositoryName: {
      collection: "workflowTasksByRepositoryName",
      index: "gsi1pk-gsi1sk-index",
      pk: {
        field: "gsi1pk",
        composite: ["repositoryFullName"],
      },
      sk: {
        field: "gsi1sk",
        composite: ["headCommit"],
      },
    },
  },
});

export default workflow;
