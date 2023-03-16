import { EventBridgeHandler } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";
import { workflowLoggingService } from "@evergreendocs/services";

import GithubRepo from "./services/github-repo.js";
import EvergreenConfig from "./schema/evergreen-config.js";
import ConfigError from "./config-error.js";
import Task from "./task.js";

const handler: EventBridgeHandler<"push", PushEvent, boolean> = async (event) => {
  const gitEvent = event?.detail;

  if (!gitEvent?.commits?.length) {
    return true;
  }

  console.log("Received event", {
    repository: gitEvent.repository?.full_name,
    ref: gitEvent.ref,
    commits: gitEvent.commits.map((commit) => commit.id),
  });

  const repoOwner = gitEvent.repository?.owner?.login;
  const repoName = gitEvent.repository?.name;
  const installationId = gitEvent.installation?.id;
  const headCommit = gitEvent.head_commit?.id;
  const repositoryFullName = gitEvent.repository?.full_name;
  const commitBranch = gitEvent.ref.replace("refs/heads/", "");

  if (!repoOwner || !repoName || !installationId || !headCommit) {
    return false;
  }

  await workflowLoggingService.entities.workflow
    .create({
      headCommit,
      headCommitMessage: gitEvent.head_commit?.message || "Unknown commit message",
      repositoryFullName,
      status: "in_progress",
    })
    .go();

  const githubRepo = new GithubRepo({ repoOwner, repoName, installationId });

  const [config] = await githubRepo.fetchFiles(["evergreen.config.json"], commitBranch);

  if (!config) {
    await workflowLoggingService.entities.workflow
      .patch({ headCommit })
      .set({ status: "skipped", reason: "No config" })
      .go();

    return true;
  }

  let parsedConfig;

  try {
    parsedConfig = EvergreenConfig.parse(JSON.parse(config.content));
  } catch (error) {
    await workflowLoggingService.entities.workflow
      .patch({ headCommit })
      .set({ status: "failed", reason: "Invalid config" })
      .go();

    return true;
  }

  await Promise.all(
    parsedConfig.generates.map(async (presetConfig, presetIndex) => {
      const task = new Task(presetConfig, presetIndex, gitEvent, githubRepo);

      try {
        await task.run();
      } catch (error) {
        let reason = "Unknown error";

        if (error instanceof Error) {
          console.error("Failed to update preset", {
            error,
            preset: presetConfig.preset,
            repository: gitEvent.repository?.full_name,
            ref: gitEvent.ref,
            commits: gitEvent.commits.map((commit) => commit.id),
          });

          if (error instanceof ConfigError) {
            reason = error.message;
          } else {
            reason = "Internal error";
          }
        }

        await workflowLoggingService.entities.task
          .patch({ headCommit, preset: presetConfig.preset, index: presetIndex })
          .set({ status: "failed", reason })
          .go();
      }
    })
  );

  await workflowLoggingService.entities.workflow
    .patch({ headCommit })
    .set({ status: "success" })
    .go();

  console.log("Processed event", {
    repository: gitEvent.repository?.full_name,
    ref: gitEvent.ref,
    commits: gitEvent.commits.map((commit) => commit.id),
  });

  return true;
};

export { handler };
