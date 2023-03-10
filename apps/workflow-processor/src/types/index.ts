import { components as Components } from "@octokit/openapi-types";

type WorkflowProcessorFile = Components["schemas"]["git-tree"]["tree"][number] & {
  content: string;
};

export * from "./package-json.js";
export type { WorkflowProcessorFile };
