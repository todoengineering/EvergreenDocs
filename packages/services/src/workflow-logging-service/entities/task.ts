import { Entity } from "electrodb";

const task = new Entity({
  model: {
    entity: "task",
    version: "1",
    service: "workflowLoggingService",
  },
  attributes: {
    index: {
      type: "number",
      required: true,
    },
    preset: {
      type: ["code-comment", "readme", "translate"] as const,
      required: true,
    },
    headCommit: {
      type: "string",
      required: true,
    },
    repositoryFullName: {
      type: "string",
      required: true,
    },
    status: {
      type: ["skipped", "in_progress", "failed", "success", "cancelled"] as const,
      required: true,
    },
    outputPullRequestUrl: {
      type: "string",
    },
    outputCommit: {
      type: "string",
    },
    outputCommitMessage: {
      type: "string",
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
    task: {
      collection: "workflowTasks",
      pk: {
        field: "pk",
        composite: ["headCommit"],
      },
      sk: {
        field: "sk",
        composite: ["preset", "index"],
      },
    },
    taskByRepositoryName: {
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

export default task;
